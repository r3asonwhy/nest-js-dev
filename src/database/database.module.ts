import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model'; // Example model

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql', // Replace with your DB dialect (mysql, postgres, etc.)
      host: 'localhost', // Database host
      port: 3306, // Database port
      username: 'root', // Database username
      password: 'root', // Database password
      database: 'template_db', // Database name
      models: [User], // List of models to initialize
      autoLoadModels: true, // Automatically load models
      synchronize: true // Sync database on every application start (use with caution in production)
    }),
    SequelizeModule.forFeature([User]) // Register models
  ],
  exports: [SequelizeModule]
})
export class DatabaseModule {}
