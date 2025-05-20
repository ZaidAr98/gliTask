import { Controller, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { CreateProductDto } from "./dto/CreateProduct";
import { Product } from '@prisma/client';
import { UpdateProductDto } from "./dto/UpdateProductDto";

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


async getProduct(id:number):Promise<Product | null>{
    return this.prisma.product.findFirst({
        where:{id}
    })
}


async getAllProducts(): Promise<Product[]> {
  return this.prisma.product.findMany();
}

}
