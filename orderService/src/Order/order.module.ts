import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { PrismaService } from './prisma/prisma.service';
import { OrderController } from './order.controller'; // <-- Add this import
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports:[ClientsModule.register([
      {
        name: 'ORDER_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: 'order-productService_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ])],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class OrderModule {}