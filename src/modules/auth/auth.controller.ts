import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.createUserRegister(registerDto);
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return await this.authService.login(req.user);
  }
}
