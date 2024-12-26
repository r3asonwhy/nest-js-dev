import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LogService } from './log.service';
import { Log } from './entities/log.entity';
import { AppConfigModule } from '@/config/app/config.module';
import { LogController } from './log.controller';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Log]),
    AppConfigModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule)
  ],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService, SequelizeModule],
})
export class LogModule {}
