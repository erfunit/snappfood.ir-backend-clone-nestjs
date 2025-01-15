import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 40)
  manager_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 90)
  manager_family: string;

  @ApiProperty()
  @IsMobilePhone('fa-IR')
  mobile: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 90)
  store_name: string;

  @ApiProperty()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  @IsNumber()
  category_id: number;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  @IsNumber()
  @IsOptional()
  agent_id: number;
}
