import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1/api');

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Order Service API')
    .setDescription('API documentation for the Order microservice')
    .setVersion('1.0')
    .addTag('orders')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/api/docs', app, document);

  const port = process.env.PORT ?? 3100;
  await app.listen(port);

  console.log(`Order service is running on: http://localhost:${port}/v1/api`);
  console.log(
    `Swagger docs available at: http://localhost:${port}/v1/api/docs`,
  );
}
bootstrap();
