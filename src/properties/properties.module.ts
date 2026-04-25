import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from './entities/property.entity';
import { User } from '../users/entities/user.entity'; // 👈 استدعاء خريطة المستخدم

@Module({
  // 👈 ضفنا الـ User هنا جنب العقار عشان السيرفيس تقدر تشوفه
  imports: [TypeOrmModule.forFeature([Property, User])], 
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}