import { Config } from '@/models/configs/entities/config.entity';
import { Log } from '@/models/logs/entities/log.entity';
import { MediaFile } from '@/models/media-files/entities/media-file.entity';
import { PageSection } from '@/models/pages/entities/page-section.entity';
import { Page } from '@/models/pages/entities/page.entity';
import { Slug } from '@/models/slugs/entities/slug.entity';
import { Token } from '@/models/tokens/entities/token.entity';
import { User } from '@/models/users/entities/user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';

@Injectable()
export class DatabaseConfigService implements SequelizeOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  get dialect(): string {
    const dbType = this.configService.get<string>('DB_TYPE');
    if (!dbType) {
      throw new InternalServerErrorException('Database dialect is not defined in environment variables!');
    }
    return dbType;
  }

  get host(): string {
    return this.configService.get<string>(`${this.dialect.toUpperCase()}_DB_HOST`)!;
  }

  get port(): number {
    return this.configService.get<number>(`${this.dialect.toUpperCase()}_DB_PORT`)!;
  }

  get username(): string {
    return this.configService.get<string>(`${this.dialect.toUpperCase()}_DB_USER`)!;
  }

  get password(): string {
    return this.configService.get<string>(`${this.dialect.toUpperCase()}_DB_PASSWORD`)!;
  }

  get database(): string {
    return this.configService.get<string>(`${this.dialect.toUpperCase()}_DB_NAME`)!;
  }

  get synchronize(): boolean {
    return this.parseBoolean(this.configService.get<string>('DB_SYNC'));
  }
  
  get alter(): boolean {
    return this.parseBoolean(this.configService.get<string>('DB_ALTER'));
  }

  get models(): any[] {
    return [User, Token, Log, MediaFile, Config, Page, PageSection, Slug];
  }

  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      dialect: this.dialect as any,
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      database: this.database,
      models: this.models,
      autoLoadModels: false,
      synchronize: this.synchronize,
      logging: console.log,
    };
  }

  private parseBoolean(value: string | undefined): boolean {
    const trueValues = ['true', '1', 'yes', 'on'];
    return trueValues.includes((value || '').toLowerCase());
  }
}
