import { IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateSaleDto {
  @IsNumber()
  clientId: number;

  @IsString()
  bookId: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}
