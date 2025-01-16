import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class Food {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @ApiProperty({ format: 'binary' })
  @IsString()
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
