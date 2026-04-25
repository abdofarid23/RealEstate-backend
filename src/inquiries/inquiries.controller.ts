import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { AuthGuard } from '../auth.guard';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('📩 طلبات التواصل (Inquiries)')
@ApiBearerAuth()
@UseGuards(AuthGuard) // كل المسارات هنا محتاجة تسجيل دخول
@Controller('api/inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  // --- مسار إرسال طلب (متاح للكل سواء عميل أو سمسار) ---
  @ApiOperation({ summary: 'إرسال طلب تواصل بخصوص عقار' })
  @Post()
  async create(@Body() createInquiryDto: CreateInquiryDto, @Request() req) {
    return this.inquiriesService.create(createInquiryDto, req.user.sub);
  }

  // --- مسار السمسار عشان يشوف طلباته ---
  @ApiOperation({ summary: 'عرض الطلبات الواردة على عقاراتي (للسماسرة فقط)' })
  @Roles('agent', 'admin') // 👈 حماية: السماسرة بس
  @UseGuards(RolesGuard)
  @Get('received')
  async getReceivedInquiries(@Request() req) {
    return this.inquiriesService.getAgentInquiries(req.user.sub);
  }

  // --- مسار العميل عشان يشوف طلباته اللي بعتها ---
  @ApiOperation({ summary: 'عرض الطلبات التي قمت بإرسالها' })
  @Get('sent')
  async getSentInquiries(@Request() req) {
    return this.inquiriesService.getClientInquiries(req.user.sub);
  }

  // --- مسار تغيير حالة الطلب ---
  @ApiOperation({ summary: 'تغيير حالة الطلب (للسماسرة فقط)' })
  @Roles('agent', 'admin')
  @UseGuards(RolesGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string, 
    @Body('status') status: string, 
    @Request() req
  ) {
    return this.inquiriesService.updateStatus(id, status, req.user.sub);
  }
}