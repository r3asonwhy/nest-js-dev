import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CognitoConfigService {
  constructor(private readonly configService: ConfigService) {}

  get userPoolId(): string {
    return this.configService.get<string>('cognito.userPoolId', '');
  }

  get clientId(): string {
    return this.configService.get<string>('cognito.clientId', '');
  }

  get region(): string {
    return this.configService.get<string>('cognito.region', '');
  }

  get accessKeyId(): string {
    return this.configService.get<string>('cognito.accessKeyId', '');
  }

  get secretAccessKey(): string {
    return this.configService.get<string>('cognito.secretAccessKey', '');
  }

  get jwksUri(): string {
    return this.configService.get<string>('cognito.jwksUri');
  }
}
