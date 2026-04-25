import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Property } from '../properties/entities/property.entity';
import { Inquiry } from '../inquiries/entities/inquiry.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Property) private propertiesRepository: Repository<Property>,
    @InjectRepository(Inquiry) private inquiriesRepository: Repository<Inquiry>,
  ) {}

  // 1. دالة الإحصائيات الشاملة
  async getDashboardStats() {
    const totalUsers = await this.usersRepository.count();
    const totalProperties = await this.propertiesRepository.count();
    const totalInquiries = await this.inquiriesRepository.count();

    return {
      message: 'إحصائيات النظام الحالية',
      stats: {
        users: totalUsers,
        properties: totalProperties,
        inquiries: totalInquiries,
      }
    };
  }

  // 2. دالة عرض كل المستخدمين
  async getAllUsers() {
    return await this.usersRepository.find({
       // بنختار نعرض الأعمدة دي بس عشان منبعتش الباسووردات للفرونت إند
       select: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt'],
       order: { createdAt: 'DESC' }
    });
  }
}