import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '@app/modules/auth/entities/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../jwt/jwt.strategies';
import { LocalStrategy } from '../jwt/local.strategy';
import { JwtTokenService } from '../jwt/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.access.secret'),
        signOptions: {
          expiresIn: config.get<string>('jwt.access.expiresIn'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, User, LocalStrategy, JwtStrategy, JwtTokenService],
  exports: [AuthService, JwtTokenService],
})
export class AuthModule {}
