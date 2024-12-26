import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokenService } from './token.service';
import { Token } from './entities/token.entity';
import { AppConfigModule } from '@/config/app/config.module';

@Module({
  imports: [SequelizeModule.forFeature([Token]), AppConfigModule],
  providers: [TokenService],
  exports: [TokenService, SequelizeModule],
})
export class TokenModule {}
