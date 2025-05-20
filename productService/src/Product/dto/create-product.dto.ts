import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Smartphone',
    description: 'Name of the product',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 599.99,
    description: 'Price of the product (must be non-negative)',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 50,
    description: 'Stock quantity of the product (must be non-negative)',
  })
  @IsNumber()
  @Min(0)
  stock: number;
}
