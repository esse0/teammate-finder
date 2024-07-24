import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request as RequestType } from 'express';

type JwtPayload = {
    sub: string,
    login: string,
    role: string
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService) {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
            jwtFromRequest: ExtractJwt.fromExtractors([
                AtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
              ]),
              ignoreExpiration: false,
              secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
        });
    }

    private static extractJWT(req: RequestType): string | null {
        if (
          req.cookies &&
          'accessToken' in req.cookies &&
          req.cookies.accessToken.length > 0
        ) {
          return req.cookies.accessToken;
        }
        return null;
      }

    validate(payload: JwtPayload) {
        return payload;
    }
}