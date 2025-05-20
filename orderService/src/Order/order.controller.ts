import { Body, Controller, Injectable, Post } from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from '@prisma/client';
import { OrderService } from './order.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Validation or stock error' })
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
