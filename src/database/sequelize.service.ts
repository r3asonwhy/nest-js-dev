import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { DatabaseConfigService } from '@/config/database/config.service';

@Injectable()
export class SequelizeService implements OnModuleInit {
  private sequelize: Sequelize;

  constructor(private readonly dbConfigService: DatabaseConfigService) {
    this.sequelize = new Sequelize({
      models: dbConfigService.models,
      dialect: dbConfigService.dialect as SequelizeOptions['dialect'],
      host: dbConfigService.host,
      username: dbConfigService.username,
      password: dbConfigService.password,
      database: dbConfigService.database,
      port: dbConfigService.port,
      logging: console.log,
    });
  }

  async onModuleInit(): Promise<void> {
    if (this.dbConfigService.synchronize) {
      await this.sequelize.sync({ alter: this.dbConfigService.alter });
      console.log('Database synchronized successfully with alter option');
    } else {
      console.log('Database synchronization is disabled');
    }
  }

  getSequelizeInstance(): Sequelize {
    return this.sequelize;
  }
}
