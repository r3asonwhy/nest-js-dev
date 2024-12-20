import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './database/user.controller';
import { UserService } from './database/user.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService]
})
export class AppModule {}
