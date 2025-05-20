
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL as string],
    queue: 'productService_queue',
    queueOptions: {
      durable: false
    },
  },
});

 await app.listen();
  console.log('Microservice product queue is running');
}
bootstrap();
