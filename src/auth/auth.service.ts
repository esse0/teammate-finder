import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthSignupDto } from './dto/auth.signup.dto';
import * as bcrypt from 'bcrypt'
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { AuthSigninDto } from './dto/auth.signin.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, private readonly configService: ConfigService) {}

    async signup(dto: AuthSignupDto): Promise<User>{
        const {email, password, login} = dto;

        const foundEmail = await this.prisma.user.findUnique({where: {email}});

        if(foundEmail){
            throw new ForbiddenException('Email already exists');
        }

        const foundLogin = await this.prisma.user.findUnique({where: {login}});

        if(foundLogin){
            throw new ForbiddenException('Login already exists');
        }

        const hashedPassword = await this.getHash(password);

        const newUser = await this.prisma.user.create({ data: {
            email: email,
            login: login,
            password: hashedPassword
        }});

        return newUser;
    }

    async signin(dto: AuthSigninDto){
        const {email, password} = dto;
        
        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        
        if(!user) {
            throw new ForbiddenException('Access denied');
        }

        const passwordMatches = await bcrypt.compare(password, user.password)

        if(!passwordMatches) {
            throw new ForbiddenException('Access denied');
        }
        
        const tokens = await this.getTokens(user.id, user.login, user.role);

        await this.updateRtHash(user.id, tokens.refresh_token);

        return {"tokens": tokens, "user": user };
    }

    async signout(userId: string){
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRefreshToken: {
                    not: null
                },
            },
            data:{
                hashedRefreshToken: null
            }
        });
    }

    async refreshTokens(userId: string, rt: string){
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        
        if(!user || user.hashedRefreshToken == null) throw new ForbiddenException('Access denied');
        //await bcrypt.compare(rt, user.hashedRefreshToken)
        const rtMatches = rt === user.hashedRefreshToken;

        if(!rtMatches) throw new ForbiddenException('Access denied');

        const tokens = await this.getTokens(user.id, user.login, user.role);

        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async updateRtHash(userId: string, rt: string){
        //const hash = await this.getHash(rt);
        
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                hashedRefreshToken: rt
            }
        })
    }

    async getHash(data: string){
        const saltOrRounds = 10;

        const hashedData = await bcrypt.hash(data, saltOrRounds);

        return hashedData;
    }

    async getUser(login:string){
        return await this.prisma.user.findUnique({where:{login:login}});
    }

    async getTokens(userId: string, login: string, role: string): Promise<Tokens>{
        
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    login,
                    role
                }, 
                {
                    secret: this.configService.get('ACCESS_TOKEN_SECRET'), // move to env
                    expiresIn: 60 * 15,
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    login,
                    role
                }, 
                {
                    secret: this.configService.get('REFRESH_TOKEN_SECRET'),
                    expiresIn: 60 * 60 * 24 * 7,
                }
            ),
        ]);
        
        return {
            access_token: at,
            refresh_token: rt
        }
    }
}
