import { IsInt, IsString, IsOptional, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateActionDto {
  @IsString()
  actionType: string;

  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  shopId: number;

  changeQuantity?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? null) 
  description?: string;

  actionDate?: string;
}
