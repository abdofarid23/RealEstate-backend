import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. بنقرا الختم اللي حطيناه فوق المسار عشان نعرف مين المطلوب
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // 2. لو المسار مفيهوش ختم، يبقى مسموح لأي حد
    if (!requiredRoles) {
      return true; 
    }

    // 3. بنجيب بيانات المستخدم من الطلب (اللي الـ AuthGuard حطها قبل كده)
    const { user } = context.switchToHttp().getRequest();
    
    // 4. المقارنة الحاسمة: هل دور المستخدم ده موجود جوه لستة الأدوار المطلوبة؟
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('عفواً، حسابك كعميل عادي ملوش صلاحية يضيف أو يعدل عقارات. لازم تكون سمسار أو مدير!');
    }

    return true;
  }
}