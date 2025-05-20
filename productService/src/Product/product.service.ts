import { BadRequestException, Controller, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from '@prisma/client';
import { UpdateProductDto } from "./dto/update-product.dto";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService,
    @Inject('PRODUCT_CLIENT') private readonly productClient: ClientProxy,
  ) {}

  async create(data: CreateProductDto):Promise<Product> {
    return this.prisma.product.create({ data });
  }


  async update(id: number, data: UpdateProductDto): Promise<Product> {
  return this.prisma.product.update({
    where: { id },
    data,
  });
}


async getProductById(id:number):Promise<Product | null>{
    return this.prisma.product.findFirst({
        where:{id}
    })
}


async getAllProducts(): Promise<Product[]> {
  return this.prisma.product.findMany();
}

async reduceStock(productId:number,quantity:number){
  const product = await this.prisma.product.findUnique({
    where:{id:productId}
  })


 if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }
   const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        stock: product.stock - quantity,
      },
    });

     return {
      success: true,
      product: {
        id: updatedProduct.id,
        stock: updatedProduct.stock,
      },
    };
}



async deleteProduct(id: number): Promise<Product> {
  const response: { hasActiveOrders: boolean } = await firstValueFrom(
    this.productClient.send('check-product-orders', { productId: id }),
  );

  if (response.hasActiveOrders) {
    throw new BadRequestException('Cannot delete product with active orders');
  }

  return this.prisma.product.delete({
    where: { id },
  });
}





}
