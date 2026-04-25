import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // 👈 1. استدعاء Swagger

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors();

  // --- 🚀 2. إعدادات Swagger (واجهة التوثيق) ---
  const config = new DocumentBuilder()
    .setTitle('Real Estate API - Farid Zone') // اسم المشروع
    .setDescription('التوثيق الرسمي لواجهة برمجة تطبيقات إدارة العقارات') // الوصف
    .setVersion('1.0') // الإصدار
    .addBearerAuth() // 👈 السطر ده سحري: بيعمل زرار في الواجهة عشان تحط منه التوكن
    .build();
    
  // توليد الصفحة وربطها بالمسار /api/docs
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); 

  await app.listen(3000);
}
bootstrap();