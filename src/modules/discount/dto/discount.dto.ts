import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class DiscountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @Transform(({ value }) => {
    if (value === undefined || value === null) return value;
    return typeof value === 'string' ? parseFloat(value) : value;
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percent: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'for how many days?' })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  @IsNumber()
  expires_in: number;

  @ApiPropertyOptional({ description: 'for how many usage time?' })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  @IsNumber()
  limit: number;

  @ApiPropertyOptional({ default: 'true' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  active: boolean;
}
