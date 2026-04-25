import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService, // استدعينا صانع التوكن
  ) {}

  // 1. دالة تسجيل مستخدم جديد (زي ما هي)
  async register(userData: any) {
    const existingUser = await this.usersRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new ConflictException('الإيميل ده متسجل بيه حساب قبل كده!');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || 'client',
    });
  const savedUser: any = await this.usersRepository.save(newUser);
    const { password, ...result } = savedUser;
    return result;
  }

  // 2. دالة تسجيل الدخول (الجديدة)
  async login(loginData: any) {
    // - ندور على المستخدم بالإيميل
    const user = await this.usersRepository.findOne({ where: { email: loginData.email } });
    if (!user) {
      throw new UnauthorizedException('الإيميل أو الباسوورد غلط!');
    }

    // - نقارن الباسوورد اللي دخله بالباسوورد المتشفر
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('الإيميل أو الباسوورد غلط!');
    }

    // - لو كله صح، نعمله التوكن
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload), // ده التوكن اللي هيرجعله
      user: {
        id: user.id,
        firstName: user.firstName,
        role: user.role,
      },
      
    };
  }
  async findAll() {
    return await this.usersRepository.find({
      // إخفاء الباسوورد من الاستعلام لأسباب أمنية
      select: ['id', 'firstName', 'lastName', 'email', 'role'] 
    });
  }
}