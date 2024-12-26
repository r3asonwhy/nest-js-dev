import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { AppConfigService } from './config.service';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        APP_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        APP_URL: Joi.string().uri().default('http://localhost'),
        APP_PORT: Joi.number().default(9000),
        APP_HOST: Joi.string().default('localhost'),
        CODE_VALIDITY_PERIOD: Joi.number().default(10),
        ACCESS_TOKEN_TTL: Joi.string().default('1h'),
        REFRESH_TOKEN_TTL: Joi.string().default('7d'),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
