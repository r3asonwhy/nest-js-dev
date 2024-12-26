import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminConfigController } from './admin-config.controller';
import { Config } from '@/models/configs/entities/config.entity';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/models/users/user.module';
import { AdminConfigService } from './admin-config.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Config]),
    AuthModule,
    UserModule
  ],
  controllers: [AdminConfigController],
  providers: [AdminConfigService],
  exports: [AdminConfigService],
})
export class AdminConfigModule {}
