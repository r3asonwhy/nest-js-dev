import { Module } from '@nestjs/common';
import { CognitoService } from './cognito.service';
import { CognitoConfigModule } from '@/config/cognito/config.module';
import { AppConfigModule } from '@/config/app/config.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [
    CognitoConfigModule, 
    AppConfigModule,
    JwtModule,
  ],
  providers: [CognitoService],
  exports: [CognitoService],
})
export class CognitoModule {}
