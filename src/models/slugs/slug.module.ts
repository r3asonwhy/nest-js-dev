import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/models/users/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Slug } from '../slugs/entities/slug.entity';
import { SlugService } from './slug.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Slug]), 
    AuthModule, 
    UserModule,
  ],
  providers: [SlugService],
  exports: [SlugService, SequelizeModule],
})
export class SlugModule {}
