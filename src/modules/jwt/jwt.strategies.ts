import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadEncrypted } from '@app/core/interface/jwt.interface';
import { decryptPayload } from '@app/core/utils/jwt-encryption.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.access.secret'),
      algorithms: ['HS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayloadEncrypted) {
    const encrypt =
      this.configService.get<string>('jwt.encryptPayload') === 'true';
    const { data } = payload;

    if (encrypt && data) {
      const decrypted = decryptPayload(
        data,
        this.configService.get<string>('jwt.encryption.key'),
        this.configService.get<string>('jwt.encryption.iv'),
      );

      return decrypted;
    }

    return payload;
  }
}
