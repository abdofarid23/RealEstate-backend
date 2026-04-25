import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway], // 👈 ضفنا السطر ده عشان باقي المشروع يقدر يشوفها
})
export class NotificationsModule {}