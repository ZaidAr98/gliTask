import { BadRequestException, Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/CreateProduct';
import { Product } from '@prisma/client';
import { UpdateProductDto } from './dto/UpdateProductDto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      console.error('Create product error:', error);
      throw new BadRequestException('Failed to create product');
    }
  }

@Patch('update/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const updated = await this.productService.update(id, updateProductDto);
      if (!updated) {
        throw new NotFoundException('Product not found');
      }
      return updated;
    } catch (error) {
      console.error('Update error:', error);
      throw new BadRequestException('Failed to update product');
    }
  }

  @Get(':id')
  async getProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product>{
 try {
       const product  = await this.productService.getProduct(id);
    if(!product){
         throw new NotFoundException('Product not found')
    }
    return product
 } catch (error) {
     console.error('get product error:', error);
      throw new BadRequestException('Failed to get product'); 
 }
  }



 @Get()
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


}
  
