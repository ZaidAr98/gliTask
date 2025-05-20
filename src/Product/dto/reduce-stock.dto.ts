import { IsInt, IsPositive } from 'class-validator';

export class ReduceStockDto {
  @IsInt({ message: 'productId must be an integer' })
  @IsPositive({ message: 'productId must be a positive number' })
  productId: number;

  @IsInt({ message: 'quantity must be an integer' })
  @IsPositive({ message: 'quantity must be a positive number' })
  quantity: number;
}
