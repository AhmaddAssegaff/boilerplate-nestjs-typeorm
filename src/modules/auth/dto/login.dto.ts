import { RegisterDto } from '@modules/auth/dto/register.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto implements RegisterDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username for the new account',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (plain text, will be hashed)',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
