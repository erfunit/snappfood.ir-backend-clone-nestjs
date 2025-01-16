import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddToBasketDto {
  @ApiProperty()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  @IsNumber()
  foodId: number;
}

export class DiscountBasketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
