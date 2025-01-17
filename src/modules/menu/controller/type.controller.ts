import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MenuTypeService } from '../service/type.service';
import { SupplierAuthGuard } from 'src/modules/supplier/guard/supplier-auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes';
import { MenuTypeDto } from '../dto/menu-type.dto';

@Controller('menu-type')
@ApiTags('Menu Types')
export class MenuTypeController {
  constructor(private readonly menuTypeService: MenuTypeService) {}

  @Post()
  @UseGuards(SupplierAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  create(@Body() createDto: MenuTypeDto) {
    return this.menuTypeService.create(createDto);
  }

  @Get()
  findAll() {
    return this.menuTypeService.findAll();
  }

  @Get(':id')
  @UseGuards(SupplierAuthGuard)
  @ApiBearerAuth('Authorization')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.menuTypeService.findOneById(id);
  }

  @Patch(':id')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  @UseGuards(SupplierAuthGuard)
  @ApiBearerAuth('Authorization')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() menuTypeDto: MenuTypeDto,
  ) {
    return this.menuTypeService.update(id, menuTypeDto);
  }

  @Delete(':id')
  @UseGuards(SupplierAuthGuard)
  @ApiBearerAuth('Authorization')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuTypeService.remove(id);
  }
}
