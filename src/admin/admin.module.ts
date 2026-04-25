import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/entities/user.entity';
import { Property } from '../properties/entities/property.entity';
import { Inquiry } from '../inquiries/entities/inquiry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Property, Inquiry])], // 👈 إعطاء المدير صلاحية رؤية كل الجداول
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}