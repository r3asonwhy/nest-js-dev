import { Module } from '@nestjs/common';
import { AdminPageController } from './admin-page.controller';
import { AdminPageService } from './admin-page.service';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/models/users/user.module';
import { SlugModule } from '@/models/slugs/slug.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Page } from '@/models/pages/entities/page.entity';
import { PageSection } from '@/models/pages/entities/page-section.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Page, PageSection]),
    AuthModule, 
    UserModule,
    SlugModule
  ],
  controllers: [AdminPageController],
  providers: [AdminPageService],
  exports: [AdminPageService],
})
export class AdminPageModule {}
