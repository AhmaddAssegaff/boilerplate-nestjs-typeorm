import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, Token } from '@app/core/interface/jwt.interface';
import {
  decryptPayload,
  encryptPayload,
} from '@app/core/utils/jwt-encryption.util';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private shouldEncrypt(): boolean {
    return this.configService.get<string>('jwt.encryptPayload') === 'true';
  }

  private preparePayload(payload: JwtPayload): any {
    if (this.shouldEncrypt()) {
      return {
        data: encryptPayload(
          payload,
          this.configService.get<string>('jwt.encryption.key'),
          this.configService.get<string>('jwt.encryption.iv'),
        ),
      };
    }
    return payload;
  }

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    const data = this.preparePayload(payload);

    return this.jwtService.signAsync(data, {
      secret: this.configService.get<string>('jwt.access.secret'),
      expiresIn: this.configService.get<string>('jwt.access.expiresIn'),
    });
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    const data = this.preparePayload(payload);

    return this.jwtService.signAsync(data, {
      secret: this.configService.get<string>('jwt.refresh.secret'),
      expiresIn: this.configService.get<string>('jwt.refresh.expiresIn'),
    });
  }

  async generateTokens(payload: JwtPayload): Promise<Token> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.verifyToken(
      token,
      this.configService.get<string>('jwt.access.secret'),
    );
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.verifyToken(
      token,
      this.configService.get<string>('jwt.refresh.secret'),
    );
  }

  private async verifyToken(token: string, secret: string) {
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, { secret });

      if ('data' in decoded && this.shouldEncrypt()) {
        return decryptPayload(
          decoded.data,
          this.configService.get<string>('jwt.encryption.key'),
          this.configService.get<string>('jwt.encryption.iv'),
        );
      }

      return decoded as JwtPayload;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
