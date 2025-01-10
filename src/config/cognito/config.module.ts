import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { CognitoConfigService } from './config.service';

@Module({
  imports: [NestConfigModule.forFeature(configuration)],
  providers: [CognitoConfigService],
  exports: [CognitoConfigService],
})
//
export class CognitoConfigModule {}
