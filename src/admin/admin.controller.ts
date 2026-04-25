import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth.guard';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('👑 لوحة الإدارة (Admin)')
@ApiBearerAuth()
@Roles('admin') // 👈 الحماية الأقوى: لازم يكون أدمن
@UseGuards(AuthGuard, RolesGuard)
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'عرض إحصائيات النظام الشاملة' })
  @Get('stats')
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  @ApiOperation({ summary: 'عرض قائمة بكل المستخدمين المسجلين' })
  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }
}