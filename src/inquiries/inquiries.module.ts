import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiriesService } from './inquiries.service';
import { InquiriesController } from './inquiries.controller';
import { Inquiry } from './entities/inquiry.entity';
import { Property } from '../properties/entities/property.entity';
import { NotificationsModule } from '../notifications/notifications.module'; // 👈 1. استدعاء الموديول

@Module({
  imports: [
    TypeOrmModule.forFeature([Inquiry, Property]),
    NotificationsModule // 👈 2. تعريفه هنا
  ], 
  controllers: [InquiriesController],
  providers: [InquiriesService],
})
export class InquiriesModule {}