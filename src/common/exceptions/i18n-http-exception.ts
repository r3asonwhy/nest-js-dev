import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

export class I18nHttpException extends HttpException {
  public readonly code: string;
  public readonly timestamp: string;
  public readonly success: boolean;

  private static i18nService: I18nService;

  constructor(code: string, message: string, status: HttpStatus) {
    super(
      {
        success: false,
        error: {
          status,
          message,
          code,
          timestamp: new Date().toISOString(),
        },
      },
      status,
    );

    this.code = code;
    this.timestamp = new Date().toISOString();
  }

  static setI18nService(i18nService: I18nService): void {
    this.i18nService = i18nService;
  }

  static async create(
    code: string,
    error: { errorCode: HttpStatus; message: string },
    variables?: Record<string, unknown>,
  ): Promise<I18nHttpException> {
    if (!this.i18nService) {
      throw new Error('I18nService is not set. Please set it using setI18nService');
    }

    const translatedMessage = await this.i18nService.translate<string>(
      error.message,
      { args: variables }
    ) as string;
    return new I18nHttpException(code, translatedMessage, error.errorCode);
  }

  static createSync(
    code: string,
    error: { errorCode: HttpStatus; message: string },
  ): I18nHttpException {
    return new I18nHttpException(code, error.message, error.errorCode);
  }
}
