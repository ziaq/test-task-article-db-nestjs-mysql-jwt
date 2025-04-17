import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from '../../../config/app-config.service';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../types/jwt-payload.type';
import { ReqtWithBodyCookie } from '../types/req-with-body-cookie.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    appConfigService: AppConfigService,
    private authService: AuthService,
  ) {
    const config = appConfigService.getConfig();

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.refreshToken as string | null,
      ]),
      secretOrKey: config.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: ReqtWithBodyCookie,
    payload: JwtPayload,
  ): Promise<JwtPayload> {
    const refreshToken = req.cookies?.refreshToken;
    const fingerprint = req.body.fingerprint;

    if (!refreshToken || !fingerprint) {
      throw new UnauthorizedException('Invalid session');
    }

    const session = await this.authService.validateRefreshToken(
      payload.sub,
      refreshToken,
      fingerprint,
    );
    if (!session) throw new UnauthorizedException('Invalid session');

    return payload as unknown as JwtPayload;
  }
}
