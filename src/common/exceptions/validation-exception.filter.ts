import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { I18nService } from 'nestjs-i18n';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const exceptionResponse: any = exception.getResponse();

    if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
      const formattedErrors = await this.formatErrors(exceptionResponse.message);
      response.status(status).json({
        success: false,
        error: {
          status,
          message: await this.i18n.translate('validation.user.VALIDATION_ERROR'),
          details: formattedErrors,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      response.status(status).json(exceptionResponse);
    }
  }

  private async formatErrors(errors: ValidationError[]): Promise<any[]> {
    const formattedErrors = [];
  
    for (const error of errors) {
      const constraints = {};

      if (error.constraints) {
        for (const key in error.constraints) {
          if (error.constraints.hasOwnProperty(key)) {
            const messageWithJson = error.constraints[key];
            const [messageKey] = messageWithJson.split('|');
  
            constraints[key] = await this.i18n.translate(messageKey, {
              args: { property: error.property },
            });
          }
        }
      }
  
      formattedErrors.push({
        property: error.property,
        value: error.value || null,
        constraints: constraints,
      });
  
      if (error.children && error.children.length > 0) {
        const childErrors = await this.formatErrors(error.children);
        formattedErrors.push(...childErrors);
      }
    }
  
    return formattedErrors;
  }
}
