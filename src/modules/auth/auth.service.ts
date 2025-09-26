import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UpdateAuthDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/modules/auth/entities/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, Token } from '@app/core/interface/jwt.interface';
import { encryptPayload } from '@app/core/utils/jwt-encryption.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateTokens(user: any): Promise<Token> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const encrypt =
      this.configService.get<string>('AUTH_JWT_PAYLOAD_ENCRYPT') === 'true';

    let finalPayload: any = payload;
    if (encrypt) {
      const data = encryptPayload(
        payload,
        this.configService.get<string>('AUTH_JWT_ENCRYPTION_KEY'),
        this.configService.get<string>('AUTH_JWT_ENCRYPTION_IV'),
      );
      finalPayload = { data };
    }

    const accessToken = this.jwtService.sign(finalPayload, {
      secret: this.configService.get<string>(
        'AUTH_JWT_ACCESS_TOKEN_SECRET_KEY',
      ),
      expiresIn: this.configService.get<string>(
        'AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN',
      ),
    });

    const refreshToken = this.jwtService.sign(finalPayload, {
      secret: this.configService.get<string>(
        'AUTH_JWT_REFRESH_TOKEN_SECRET_KEY',
      ),
      expiresIn: this.configService.get<string>(
        'AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN',
      ),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async createUserRegister(registerDto: RegisterDto) {
    const { username, password } = registerDto;
    const WORK_FACTOR = 10;

    const existingUser = await this.userRepo.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('username already exist');
    }

    const passwordHased = await bcrypt.hash(password, WORK_FACTOR);

    const newUser = await this.userRepo.create({
      username,
      password: passwordHased,
    });

    const saveUser = await this.userRepo.save(newUser);
    const { password: _pwd, ...result } = saveUser;

    return result;
  }

  async validateUserLogin(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: {
        username: username,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `username ${username} tidak di temukan atau sudah tidak aktif`,
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ConflictException(`password tidak sesuai`);
    }

    const { password: _pwd, ...result } = user;
    return result;
  }

  async login(user: any) {
    return this.generateTokens(user);
  }
}
