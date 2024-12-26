import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserSeederService } from './users/users.service';
import { User } from '@/models/users/entities/user.entity';
import { DatabaseConfigService } from '@/config/database/config.service';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    SequelizeModule.forFeature([User]),
  ],
  providers: [UserSeederService],
  exports: [UserSeederService],
})
export class SeederModule {}
