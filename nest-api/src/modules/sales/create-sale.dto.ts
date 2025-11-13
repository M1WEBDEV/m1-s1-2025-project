import { IsNumber, IsPositive, IsString, Min, IsOptional, IsDateString } from 'class-validator';

export class CreateSaleDto {
  @IsNumber()
  clientId: number;

  @IsString()
  bookId: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsDateString()
  saleDate?: string;
}
