import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Order } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ORDER_CLIENT') private readonly orderClient: ClientProxy,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const { productId, quantity } = dto;
    const response: ProductResponse = await firstValueFrom(
      this.orderClient.send('check-product', { productId }),
    );

    if (!response?.exists) {
      throw new BadRequestException('Product does not exist');
    }

    const product = response.product;
    console.log(product);
    if (!product) {
      throw new BadRequestException('Product details not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }
    const total = product.price * quantity;
    await firstValueFrom(
      this.orderClient.send('reduce-stock', { productId, quantity }),
    );

    return this.prisma.order.create({
      data: {
        productId,
        quantity,
        total,
      },
    });
  }

  async getOrderByProductId(id: number): Promise<Order | null> {
    return this.prisma.order.findFirst({
      where: { productId: id },
    });
  }
}
