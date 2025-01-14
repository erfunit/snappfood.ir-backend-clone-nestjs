import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StarterService } from './starter.service';
import { CreateStarterDto } from './dto/create-starter.dto';
import { UpdateStarterDto } from './dto/update-starter.dto';

@Controller('starter')
export class StarterController {
  constructor(private readonly starterService: StarterService) {}

  @Post()
  create(@Body() createStarterDto: CreateStarterDto) {
    return this.starterService.create(createStarterDto);
  }

  @Get()
  findAll() {
    return this.starterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.starterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStarterDto: UpdateStarterDto) {
    return this.starterService.update(+id, updateStarterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.starterService.remove(+id);
  }
}
