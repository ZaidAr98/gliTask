import { Body, Controller, Injectable, Post } from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from '@prisma/client';
import { OrderService } from './order.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  async create(@Body() data: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(data);
  }


   ////microservice handlers
  @MessagePattern('check-product-orders')
  async checkProductOrders(@Payload() data: { productId: number }) {
    const activeOrders = await this.orderService.getOrderByProductId(
      data.productId,
    );
    return { hasActiveOrders: !!activeOrders };
  }
}
