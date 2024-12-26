import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminController } from './admin.controller';
import { Config } from '@/models/configs/entities/config.entity';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/models/users/user.module';
import { AdminService } from './admin.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Config]),
    AuthModule,
    UserModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
