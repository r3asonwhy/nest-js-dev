import { Module } from '@nestjs/common';
import { AdminUserController } from './admin-user.controller';
import { UserModule } from '@/models/users/user.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AdminUserController]
})
export class AdminUserModule {}
