import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // 👈 استدعاء التلميحات

export class CreatePropertyDto {
  @ApiProperty({ example: 'فيلا بحديقة وحمام سباحة', description: 'عنوان العقار الجذاب' })
  @IsString()
  @IsNotEmpty({ message: 'عنوان العقار مطلوب ومينفعش يكون فاضي!' })
  title: string;

  @ApiProperty({ example: 'فيلا 3 أدوار تشطيب الترا سوبر لوكس في قلب التجمع', description: 'وصف تفصيلي للعقار' })
  @IsString()
  @IsNotEmpty({ message: 'وصف العقار مطلوب!' })
  description: string;

  @ApiProperty({ example: 4500000, description: 'سعر العقار بالجنيه' })
  @IsNumber({}, { message: 'السعر لازم يتكتب كـ رقم مش حروف!' })
  @Min(0, { message: 'السعر مينفعش يكون بالسالب!' })
  price: number;

  @ApiProperty({ example: 'التجمع الخامس، شارع التسعين', description: 'العنوان الفعلي للعقار' })
  @IsString()
  @IsNotEmpty({ message: 'مكان أو عنوان العقار مطلوب!' })
  address: string;

  @ApiPropertyOptional({ example: 5, description: 'عدد غرف النوم (اختياري)' })
  @IsNumber()
  @IsOptional()
  bedrooms: number;

  @ApiPropertyOptional({ example: 4, description: 'عدد الحمامات (اختياري)' })
  @IsNumber()
  @IsOptional()
  bathrooms: number;

  @ApiProperty({ example: 350, description: 'مساحة العقار بالمتر المربع' })
  @IsNumber({}, { message: 'المساحة لازم تتكتب كـ رقم!' })
  @Min(10, { message: 'أقل مساحة مقبولة هي 10 متر!' })
  area: number;
}