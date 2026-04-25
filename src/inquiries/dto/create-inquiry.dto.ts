import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInquiryDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'الـ ID بتاع العقار' })
  @IsUUID('all', { message: 'معرف العقار (ID) غير صحيح!' })
  @IsNotEmpty()
  propertyId: string;

  @ApiProperty({ example: 'مهتم جداً بالفيلا دي، ممكن تفاصيل أكتر عن طرق السداد؟', description: 'رسالة العميل للسمسار' })
  @IsString()
  @IsNotEmpty({ message: 'لازم تكتب رسالة للسمسار!' })
  message: string;
}