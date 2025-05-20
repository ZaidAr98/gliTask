import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReduceStockDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the product whose stock is to be reduced',
  })
  @IsInt({ message: 'productId must be an integer' })
  @IsPositive({ message: 'productId must be a positive number' })
  productId: number;

  @ApiProperty({
    example: 3,
    description: 'Quantity to reduce from the stock',
  })
  @IsInt({ message: 'quantity must be an integer' })
  @IsPositive({ message: 'quantity must be a positive number' })
  quantity: number;
}
