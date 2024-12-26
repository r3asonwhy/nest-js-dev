import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private readonly configService: ConfigService) {}

  get secret(): string {
    return this.configService.get<string>('jwt.secret', 'default-secret');
  }

  get accessTokenTtl(): string {
    return this.configService.get<string>('jwt.accessTokenTtl', '1h');
  }
}
