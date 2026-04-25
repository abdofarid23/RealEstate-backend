import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'عميل' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'جديد' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'client@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'client', description: 'نوع الحساب: client, agent, admin' })
  @IsString()
  role: string;
}