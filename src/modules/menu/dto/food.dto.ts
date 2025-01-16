import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class FoodDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  title: string;

  @ApiProperty({ format: 'binary' })
  image: string;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  price: number;

  @ApiProperty()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(10, 300)
  description: string;

  @ApiProperty()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  @IsNumber()
  typeId: number;
}
