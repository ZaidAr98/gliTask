import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'Updated Laptop Name',
    description: 'The new name of the product (optional)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 1200,
    description: 'The new price of the product (optional)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    example: 25,
    description: 'The updated stock quantity (optional)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}
