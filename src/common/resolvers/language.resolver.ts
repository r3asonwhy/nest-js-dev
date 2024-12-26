import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';
import { LANGUAGES } from '../constants';

@Injectable()
export class LanguageResolver implements I18nResolver {
  resolve(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const lang = request.headers['accept-language'];

    if (lang && LANGUAGES.includes(lang)) {
      return lang;
    }

    return LANGUAGES[0];
  }
}
