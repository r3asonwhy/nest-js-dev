import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MediaFile } from './entities/media-file.entity';
import { MediaFileService } from './media-file.service';
import { MediaFileController } from './media-file.controller';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '../users/user.module';
import { LogModule } from '../logs/log.module';

@Module({
  imports: [
    SequelizeModule.forFeature([MediaFile]),
    AuthModule,
    UserModule,
    LogModule
  ],
  controllers: [MediaFileController],
  providers: [MediaFileService],
})
export class MediaFileModule {}
