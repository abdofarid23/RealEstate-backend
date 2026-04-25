import { SetMetadata } from '@nestjs/common';

// ده الختم بتاعنا اللي هنحدد بيه مين مسموحله يدخل
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);