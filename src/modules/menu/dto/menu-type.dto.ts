import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class MenuTypeDto {
  @ApiProperty()
  @IsString()
  @Length(3, 30)
  title: string;
}
