import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppConfigModule } from './config/app/config.module';
import { SequelizeService } from './database/sequelize.service';
import { AuthModule } from './auth/auth.module';
import { UserSeederModule } from './database/seeders/users/users.module';
import { UserModule } from './models/users/user.module';
import { DatabaseConfigService } from './config/database/config.service';
import { DatabaseConfigModule } from './config/database/config.module';
import { I18nConfigModule } from './config/i18n/i18n.module';
import { AppConfigService } from './config/app/config.service';
import { AppConfigSingleton } from '@/common/utils/config.singleton';
import { HealthModule } from './common/health/health.module';
import { I18nHttpException } from './common/exceptions/i18n-http-exception';
import { I18nService } from 'nestjs-i18n';
import { ClientPageModule } from './client/client-page.module';
import { LogModule } from './models/logs/log.module';
import { AdminUserModule } from './admin/users/admin-user.module';
import { MediaFileModule } from './models/media-files/media-file.module';
import { AdminConfigModule } from './admin/configs/admin-config.module';
import { AdminModule } from './admin/admin.module';
import { LayoutModule } from './admin/layouts/layout.module';
import { AdminMediaFileModule } from './admin/media-files/admin-media-file.module';
import { SlugModule } from './models/slugs/slug.module';
import { AdminPageModule } from './admin/pages/admin-page.module';
import { LanguageMiddleware } from './common/middlewares/language.middleware';
import { NotificationModule } from './notifications/notification.module';

@Module({
  imports: [
    NestConfigModule.forRoot({ isGlobal: true }),
    AppConfigModule,
    DatabaseConfigModule,
    SequelizeModule.forRootAsync({
      imports: [DatabaseConfigModule],
      inject: [DatabaseConfigService],
      useClass: DatabaseConfigService,
    }),
    AuthModule,
    UserSeederModule,
    UserModule,
    I18nConfigModule,
    HealthModule,
    ClientPageModule,
    LogModule,
    AdminUserModule,
    MediaFileModule,
    AdminConfigModule,
    AdminModule,
    LayoutModule,
    AdminMediaFileModule,
    SlugModule,
    AdminPageModule,
    NotificationModule,
  ],
  providers: [
    AppConfigService,
    SequelizeService
  ],
  exports: [SequelizeService]
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly i18nService: I18nService
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }

  onModuleInit() {
    AppConfigSingleton.initialize(this.appConfigService);
    I18nHttpException.setI18nService(this.i18nService);
  }
}
