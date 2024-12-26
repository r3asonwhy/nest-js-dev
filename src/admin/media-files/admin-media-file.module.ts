import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminMediaFileController } from './admin-media-file.controller';
import { AuthModule } from '@/auth/auth.module';
import { MediaFile } from '@/models/media-files/entities/media-file.entity';
import { LogModule } from '@/models/logs/log.module';
import { UserModule } from '@/models/users/user.module';
import { MediaFileService } from '@/models/media-files/media-file.service';

@Module({
  imports: [
    SequelizeModule.forFeature([MediaFile]),
    AuthModule,
    UserModule,
    LogModule
  ],
  controllers: [AdminMediaFileController],
  providers: [MediaFileService],
})
export class AdminMediaFileModule {}
