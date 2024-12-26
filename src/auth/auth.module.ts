import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/models/users/user.module';
import { TokenModule } from '@/models/tokens/token.module';
import { AppConfigModule } from '@/config/app/config.module';
import { CognitoModule } from './cognito/cognito.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { CognitoConfigModule } from '@/config/cognito/config.module';
import { LogModule } from '@/models/logs/log.module';
import { JwtModule } from './jwt/jwt.module';
import { NotificationModule } from '@/notifications/notification.module';

@Module({
  imports: [
    UserModule,
    AppConfigModule,
    TokenModule,
    JwtModule,
    CognitoModule,
    SequelizeModule,
    forwardRef(() => CognitoConfigModule),
    LogModule,
    NotificationModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
