import { AppConfigService } from '@/config/app/config.service';
import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import { ERROR_CODES } from '../error-constants';

export class AppConfigSingleton {
  private static instance: AppConfigService;

  static initialize(appConfigService: AppConfigService) {
    if (!this.instance) {
      this.instance = appConfigService;
    }
  }

  static async getInstance(): Promise<AppConfigService> {
    if (!this.instance) {
      throw await I18nHttpException.create('UTL-CNF-1', ERROR_CODES.NOT_INITIALIZED);
    }
    return this.instance;
  }
}
