import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from '../../../config/app-config.service';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(appConfigService: AppConfigService) {
    const config = appConfigService.getConfig();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtAccessSecret,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
