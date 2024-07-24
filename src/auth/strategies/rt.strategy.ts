import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { Injectable } from "@nestjs/common";
import { Request as RequestType } from 'express';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private readonly configService: ConfigService) {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // secretOrKey: 'rt-secret', // move to env
            // passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromExtractors([
                RtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
              ]),
              ignoreExpiration: false,
              secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
        });
    }

    private static extractJWT(req: RequestType): string | null {
        if (
          req.cookies &&
          'refreshToken' in req.cookies &&
          req.cookies.refreshToken.length > 0
        ) {
          return req.cookies.refreshToken;
        }
        return null;
      }

    validate(req: Request, payload) {
         return {
             payload,
             sub: req['sub'],
             role: req['role']
        }
    }
}