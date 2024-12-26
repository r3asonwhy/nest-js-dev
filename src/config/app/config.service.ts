import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get name(): string {
    return this.configService.get<string>('app.name') ?? 'DefaultAppName';
  }

  get env(): string {
    return this.configService.get<string>('app.env') ?? 'development';
  }

  get url(): string {
    const url = this.configService.get<string>('app.url');
    if (url) return url;
  
    const protocol = this.isProduction ? 'https' : 'http';
    return `${protocol}://${this.host}:${this.port}`;
  }

  get port(): number {
    return Number(this.configService.get<number>('app.port') ?? 9000);
  }

  get host(): string {
    return this.configService.get<string>('APP_HOST') || 'localhost';
  }

  get isProduction(): boolean {
    return this.env === 'production';
  }

  get codeValidityPeriod(): number {
    return this.configService.get<number>('app.codeValidityPeriod') || 10;
  }

  get accessTokenTtl(): string {
    return this.configService.get<string>('app.accessTokenTtl') ?? '1h';
  }

  get refreshTokenTtl(): string {
    return this.configService.get<string>('app.refreshTokenTtl') ?? '7d';
  }

  get jwtSecret(): string {
    return this.configService.get<string>('app.jwtSecret');
  }
}
