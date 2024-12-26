import { Module } from '@nestjs/common';
import { UserSeederService } from './users.service';
import { AppConfigService } from '@/config/app/config.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@/models/users/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserSeederService, AppConfigService],
  exports: [UserSeederService],
})
export class UserSeederModule {}
