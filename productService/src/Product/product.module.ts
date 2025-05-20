import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from './prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
   imports:[ClientsModule.register([
      {
        name: 'PRODUCT_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: 'product-orderService_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ])],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}