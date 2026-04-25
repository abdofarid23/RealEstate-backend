import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'تسجيل حساب جديد' })
  @Post('register') 
  async register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  @ApiOperation({ summary: 'تسجيل الدخول' })
  @Post('login') 
  async login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

    @Get('users')
    findAll() {
    return this.usersService.findAll();
  }
}