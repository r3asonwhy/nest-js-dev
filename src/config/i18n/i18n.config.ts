import { LanguageResolver } from '@/common/resolvers/language.resolver';
import { join } from 'path';

export const i18nConfig = {
  fallbackLanguage: 'uk',
  loaderOptions: {
    path: join(__dirname, '../../i18n'),
    watch: true,
  },
  resolvers: [LanguageResolver],
  viewEngine: 'hbs',
};
