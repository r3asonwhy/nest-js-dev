import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from './config/app/config.service';
import { SequelizeService } from './database/sequelize.service';
import { DatabaseConfigService } from './config/database/config.service';
import { AppModule } from './app.module';
import { User } from './models/users/entities/user.entity';
import { Token } from './models/tokens/entities/token.entity';
import { ResponseInterceptor } from './common/interceptors/http-response.interceptor';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Log } from './models/logs/entities/log.entity';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { getI18nService } from './common/utils/extra.util';
import { ValidationExceptionFilter } from './common/exceptions/validation-exception.filter';
import { Config } from './models/configs/entities/config.entity';
import { MediaFile } from './models/media-files/entities/media-file.entity';
import { Page } from './models/pages/entities/page.entity';
import { PageSection } from './models/pages/entities/page-section.entity';
import { Slug } from './models/slugs/entities/slug.entity';
import * as handlebars from 'handlebars';
import { helpers } from './common/helpers/handebar-helpers';
import { registerPartials } from './common/helpers/template.helper';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig: AppConfigService = app.get(AppConfigService);
  const sequelizeService = app.get(SequelizeService); 
  const dbConfigService = app.get(DatabaseConfigService);
  const i18n = getI18nService(app);

  await sequelizeService.onModuleInit();
  console.log('Database connection initialized');
  console.log(`Using database: ${dbConfigService.dialect}`);

  app.use(cookieParser());

  app.enableCors({
    origin: appConfig.isProduction
      ? 'http://automix-dev.moonart.net.ua'
      : '*', // Allow all in development
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Registration of partials
  const partialsPath = join(__dirname, '..', 'views', 'partials');
  registerPartials(partialsPath);

  Object.keys(helpers).forEach((key) => {
    handlebars.registerHelper(key, helpers[key]);
  });

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(errors);
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(
          (error) =>
            `${error.property}: ${Object.values(error.constraints).join(', ')}`
        );
        return new BadRequestException({ message: messages });
      },
    }),
  );

  app.useGlobalFilters(new ValidationExceptionFilter(i18n));

  const config = new DocumentBuilder()
    .setTitle('Project Template API')
    .setDescription('API documentation for Project Template')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'jwt', in: 'cookie' }, 'jwt')
    .addCookieAuth('jwt')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [User, Token, Log, MediaFile, Config, Page, PageSection, Slug]
  });
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(appConfig.port);
  console.log(`Application is running on: ${appConfig.url}`);
}

bootstrap();
