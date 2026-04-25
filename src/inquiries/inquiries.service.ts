import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from './entities/inquiry.entity';
import { Property } from '../properties/entities/property.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway'; // 👈 استدعاء البوابة

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private inquiriesRepository: Repository<Inquiry>,
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
    private notificationsGateway: NotificationsGateway, // 👈 حقن البوابة هنا
  ) {}

  async create(createInquiryDto: CreateInquiryDto, clientId: string) {
    const property = await this.propertiesRepository.findOne({
      where: { id: createInquiryDto.propertyId },
      relations: ['user'] 
    });

    if (!property) throw new NotFoundException('العقار ده مش موجود أصلاً!');
    
    if (property.user.id === clientId) {
      throw new BadRequestException('يا هندسة مينفعش تبعت طلب تواصل لعقارك!');
    }

    const newInquiry = this.inquiriesRepository.create({
      message: createInquiryDto.message,
      client: { id: clientId },
      property: { id: property.id }
    });

    const savedInquiry = await this.inquiriesRepository.save(newInquiry);

    // 🚀 السطر السحري: إطلاق الإشعار اللحظي لمالك العقار (السمسار)
    this.notificationsGateway.sendNotificationToAgent(property.user.id, {
      title: 'طلب تواصل جديد!',
      message: `عندك رسالة جديدة بخصوص عقارك: ${property.title}`,
      inquiryId: savedInquiry.id,
      date: savedInquiry.createdAt
    });

    return savedInquiry;
  }

  // ... (باقي الدوال زي ما هي مفيهاش تغيير)
  async getAgentInquiries(agentId: string) {
    return await this.inquiriesRepository.find({
      where: { property: { user: { id: agentId } } },
      relations: ['property', 'client'], 
      order: { createdAt: 'DESC' } 
    });
  }

  async getClientInquiries(clientId: string) {
    return await this.inquiriesRepository.find({
      where: { client: { id: clientId } },
      relations: ['property'], 
      order: { createdAt: 'DESC' }
    });
  }

  async updateStatus(inquiryId: string, status: string, agentId: string) {
    const inquiry = await this.inquiriesRepository.findOne({
      where: { id: inquiryId },
      relations: ['property', 'property.user']
    });

    if (!inquiry) throw new NotFoundException('الطلب ده مش موجود!');
    
    if (inquiry.property.user.id !== agentId) {
      throw new ForbiddenException('متقدرش تعدل حالة طلب مش بتاعك!');
    }

    inquiry.status = status;
    return await this.inquiriesRepository.save(inquiry);
  }
}