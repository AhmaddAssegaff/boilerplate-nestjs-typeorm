import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/modules/auth/entities/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtTokenService } from '@modules/jwt/jwt.service';
import { Token } from '@app/core/interface/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  private async ensureUsernameUnique(username: string): Promise<void> {
    const existingUser = await this.userRepo.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const WORK_FACTOR = 12;
    return bcrypt.hash(password, WORK_FACTOR);
  }

  async createUserRegister(registerDto: RegisterDto) {
    const { username, password } = registerDto;

    await this.ensureUsernameUnique(username);
    const passwordHashed = await this.hashPassword(password);

    const newUser = this.userRepo.create({
      username,
      password: passwordHashed,
    });

    const savedUser = await this.userRepo.save(newUser);
    const { password: _pwd, ...result } = savedUser;

    return result;
  }

  async validateUserLogin(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { username, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(`Username ${username} not found or inactive`);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _pwd, ...result } = user;
    return result;
  }

  async login(user: User): Promise<Token> {
    return this.jwtTokenService.generateTokens({
      sub: user.id,
      username: user.username,
      role: user.role,
    });
  }
}
