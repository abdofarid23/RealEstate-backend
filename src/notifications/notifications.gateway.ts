import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// 👈 الـ cors هنا مهم جداً عشان يسمح لأي واجهة أمامية (Frontend) تتصل بالخط الساخن
@WebSocketGateway({
  cors: { origin: '*' }, 
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server; // ده الراديو بتاعنا اللي هيبث الإشعارات

  // دالة بتشتغل أوتوماتيك أول ما حد يفتح الموقع
  handleConnection(client: Socket) {
    console.log(`🟢 متصل جديد بالخط الساخن: ${client.id}`);
  }

  // دالة بتشتغل أول ما حد يقفل الموقع
  handleDisconnect(client: Socket) {
    console.log(`🔴 متصل غادر الخط الساخن: ${client.id}`);
  }

  // 🚀 الدالة السحرية: دي اللي هننادي عليها عشان نبعت الإشعار لسمسار معين
  sendNotificationToAgent(agentId: string, payload: any) {
    // بنعمل قناة مخصصة باسم الـ ID بتاع السمسار، عشان مفيش سمسار يشوف إشعارات التاني
    this.server.emit(`notification-${agentId}`, payload);
  }
}