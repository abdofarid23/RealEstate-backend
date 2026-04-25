import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { AuthGuard } from '../auth.guard';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger'; // 👈 استيرادات Swagger

@ApiTags('🏢 إدارة العقارات (Properties)') // 👈 ده بيعمل قسم شيك في الواجهة
@Controller('api/properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  // --- مسار الإضافة ---
  @ApiOperation({ summary: 'إضافة عقار جديد (للسماسرة والمديرين فقط)' })
  @ApiBearerAuth() // 👈 بيظهر علامة القفل
  @Roles('agent', 'admin') 
  @UseGuards(AuthGuard, RolesGuard) 
  @Post()
  async create(@Body() propertyData: CreatePropertyDto, @Request() req) { 
    return this.propertiesService.create(propertyData, req.user.sub);
  }

  // --- مسار العرض والفلترة ---
  @ApiOperation({ summary: 'عرض كل العقارات مع الفلترة والتقسيم (متاح للجميع)' })
  @Get()
  async findAll(@Query() query: any) {
    return this.propertiesService.findAll(query);
  }

  // --- مسار عرض عقار واحد ---
  @ApiOperation({ summary: 'عرض تفاصيل عقار واحد بالـ ID (متاح للجميع)' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  // --- مسار التعديل ---
  @ApiOperation({ summary: 'تعديل بيانات عقار (لصاحب العقار فقط)' })
  @ApiBearerAuth()
  @Roles('agent', 'admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    return this.propertiesService.update(id, updateData, req.user.sub);
  }

  // --- مسار المسح ---
  @ApiOperation({ summary: 'مسح عقار (لصاحب العقار فقط)' })
  @ApiBearerAuth()
  @Roles('agent', 'admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.propertiesService.remove(id, req.user.sub);
  }

  // --- مسار رفع الصورة ---
  @ApiOperation({ summary: 'رفع صورة للعقار (لصاحب العقار فقط)' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data') // 👈 بنفهم Swagger إن ده رفع ملفات
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'صورة العقار' },
      },
    },
  })
  @Roles('agent', 'admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      }
    })
  }))
  async uploadPropertyImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) throw new BadRequestException('لازم تختار صورة لرفعها!');
    return this.propertiesService.uploadImage(id, `/uploads/${file.filename}`, req.user.sub);
  }

  // --- مسارات المفضلة ---
  @ApiOperation({ summary: 'إضافة أو حذف عقار من المفضلة' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post(':id/favorite')
  async toggleFavorite(@Param('id') id: string, @Request() req) {
    return this.propertiesService.toggleFavorite(id, req.user.sub);
  }

  @ApiOperation({ summary: 'عرض قائمة مفضلتي' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('favorites/me')
  async getMyFavorites(@Request() req) {
    return this.propertiesService.getMyFavorites(req.user.sub);
  }
}