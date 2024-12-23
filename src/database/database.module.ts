import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model'; // Example model

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql', // Replace with your DB dialect (mysql, postgres, etc.)
      port: 3306, // Database port
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      models: [User], // List of models to initialize
      autoLoadModels: true, // Automatically load models
      synchronize: true // Sync database on every application start (use with caution in production)
    }),
    SequelizeModule.forFeature([User]) // Register model
  ],
  exports: [SequelizeModule]
})
export class DatabaseModule {}
