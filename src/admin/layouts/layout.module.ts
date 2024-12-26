import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LayoutController } from './layout.controller';
import { LayoutService } from './layout.service';
import { Config } from '@/models/configs/entities/config.entity';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/models/users/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Config]),
    AuthModule,
    UserModule
  ],
  controllers: [LayoutController],
  providers: [LayoutService],
  exports: [LayoutService, SequelizeModule],
})
export class LayoutModule {}
