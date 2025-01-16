import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DiscountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  @IsNumber()
  percent: number;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'for how many days?' })
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  @IsNumber()
  expires_in: number;

  @ApiPropertyOptional({ description: 'for how many usage time?' })
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  @IsNumber()
  limit: number;

  @ApiPropertyOptional({ default: 'true' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  active: boolean;
}
