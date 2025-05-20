import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { ReduceStockDto } from './dto/reduce-stock.dto';
import { validateOrReject } from 'class-validator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID or retrieval error' })
  async getProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    try {
      const product = await this.productService.getProductById(id);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } catch (error) {
      console.error('get product error:', error);
      throw new BadRequestException('Failed to get product');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products retrieved' })
  @ApiResponse({ status: 404, description: 'No products found' })
  @ApiResponse({ status: 400, description: 'Failed to retrieve products' })
  async getProducts(): Promise<Product[]> {
    try {
      const products = await this.productService.getAllProducts();

      if (products.length === 0) {
        throw new NotFoundException('No products found');
      }

      return products;
    } catch (error) {
      console.error('Get products error:', error);
      throw new BadRequestException('Failed to get products');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Failed to create product' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      console.error('Create product error:', error);
      throw new BadRequestException('Failed to create product');
    }
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Failed to update product' })
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const product = await this.productService.getProductById(id);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return await this.productService.update(id, updateProductDto);
    } catch (error) {
      console.error('Update error:', error);
      throw new BadRequestException('Failed to update product');
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Failed to delete product' })
  async deleteProduct(@Param('id') id: number) {
    try {
      const product = await this.productService.getProductById(id);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return await this.productService.deleteProduct(+id);
    } catch (error) {
      console.error('Delete product error:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete product');
    }
  }

  ////microservice handlers

  @MessagePattern('check-product')
  async handleCheckProduct(@Payload() data: { productId: number }) {
    const product = await this.productService.getProductById(data.productId);
    if (!product) {
      return { exists: false };
    }
    return {
      exists: true,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
      },
    };
  }

  @MessagePattern('reduce-stock')
  async handleReduceStock(@Payload() data: any) {
    const dto = plainToInstance(ReduceStockDto, data);
    await validateOrReject(dto);
    return this.productService.reduceStock(dto.productId, dto.quantity);
  }
}
