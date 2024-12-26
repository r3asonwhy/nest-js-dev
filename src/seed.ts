import { NestFactory } from '@nestjs/core';
import { SeederModule } from './database/seeders/seeder.module';
import { UserSeederService } from './database/seeders/users/users.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const userSeeder = appContext.get(UserSeederService);
  await userSeeder.seed();
  await appContext.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
});
