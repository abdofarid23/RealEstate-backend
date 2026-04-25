import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('لازم تسجل دخول وتستخدم التوكن عشان تقدر تضيف عقار!');
    }

    const token = authHeader.split(' ')[1];

    try {
      // بيفك التشفير ويحط بيانات المستخدم جوه الطلب عشان نستخدمها بعدين
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'Farid_RealEstate_Secret_Key_123',
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('التوكن ده منتهي أو غير صالح!');
    }
    return true;
  }
}