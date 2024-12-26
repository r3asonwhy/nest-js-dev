import { Module } from '@nestjs/common';
import { ClientPageController } from './client-page.controller';
import { ClientPageService } from './client-page.service';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/models/users/user.module';
import { SlugModule } from '@/models/slugs/slug.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Page } from '@/models/pages/entities/page.entity';
import { PageSection } from '@/models/pages/entities/page-section.entity';
import { LayoutModule } from '@/admin/layouts/layout.module';
import { TemplateService } from '@/common/utils/template.util';

@Module({
  imports: [
    SequelizeModule.forFeature([Page, PageSection]),
    AuthModule,
    UserModule,
    SlugModule,
    LayoutModule
  ],
  controllers: [ClientPageController],
  providers: [ClientPageService, TemplateService],
})
export class ClientPageModule {}
