import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MenuService } from '../service/menu.service';
import { SupplierAuthGuard } from 'src/modules/supplier/guard/supplier-auth.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes';
import { UploadFileS3 } from 'src/common/interceptors/upload-file.interceptor';
import { FoodDto } from '../dto/food.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseGuards(SupplierAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(UploadFileS3('image'))
  create(
    @Body() foodDto: FoodDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/(jpg|png|jpeg|webp)' }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.menuService.create(foodDto, image);
  }

  @Get('full-menu/:supplierId')
  getFullMenu(@Param('supplierId', ParseIntPipe) supplierId: number) {
    return this.menuService.getFullMenu(supplierId);
  }
}
