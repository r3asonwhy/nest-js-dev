import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '@/auth/auth.module';
import { TokenModule } from '../tokens/token.module';
import { CognitoModule } from '@/auth/cognito/cognito.module';
import { LogModule } from '../logs/log.module';
import { AppConfigModule } from '@/config/app/config.module';
import { NotificationModule } from '@/notifications/notification.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TokenModule,
    SequelizeModule.forFeature([User]),
    CognitoModule,
    LogModule,
    AppConfigModule,
    NotificationModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, SequelizeModule],
})
export class UserModule {}


