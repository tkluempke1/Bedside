import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Prefix all routes with /api/v1
  app.setGlobalPrefix('api/v1');
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port);
  console.log(`API listening on port ${port}`);
}

bootstrap().catch((err) => {
  console.error(err);
});
