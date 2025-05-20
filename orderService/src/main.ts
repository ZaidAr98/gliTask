import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1/api');
  app.useGlobalPipes(new ValidationPipe( {transform: true}));
 const port = process.env.PORT ?? 3100;
  await app.listen(port);
  console.log(`Order service is running on: http://localhost:${port}/api`);
}
bootstrap();
