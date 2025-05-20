import { BadRequestException, Controller, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from '@prisma/client';
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

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





}
