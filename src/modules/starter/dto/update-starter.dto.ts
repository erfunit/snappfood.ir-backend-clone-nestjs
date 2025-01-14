import { PartialType } from '@nestjs/swagger';
import { CreateStarterDto } from './create-starter.dto';

export class UpdateStarterDto extends PartialType(CreateStarterDto) {}
