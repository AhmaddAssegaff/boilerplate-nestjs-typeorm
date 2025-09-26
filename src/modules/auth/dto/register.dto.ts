import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
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
