import { Module } from '@nestjs/common';
import { I18nModule } from 'nestjs-i18n';
import { i18nConfig } from './i18n.config';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: i18nConfig.fallbackLanguage,
      loaderOptions: i18nConfig.loaderOptions,
      resolvers: i18nConfig.resolvers,
    }),
  ],
})
export class I18nConfigModule {}
