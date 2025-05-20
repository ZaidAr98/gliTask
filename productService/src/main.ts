import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1/api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const config = new DocumentBuilder()
    .setTitle('Product Service API')
    .setDescription('API documentation for the Product microservice')
    .setVersion('1.0')
    .addTag('products') // optional: add a tag to group endpoints
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Product service is running on: http://localhost:${port}/v1/api`);
  console.log(
    `Swagger docs available at: http://localhost:${port}/v1/api/docs`,
  );
}
bootstrap();
