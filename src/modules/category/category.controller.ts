import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadFileS3 } from 'src/common/interceptors/upload-file.interceptor';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes';
import { Pagination } from 'src/common/pagination/decorator/pagination.decorator';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(UploadFileS3('image'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/(jpg|png|jpeg|webp)' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    // return { image, createCategoryDto };
    return this.categoryService.create(createCategoryDto, image);
  }

  @Get()
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findOneBySlugControllerWrapper(slug);
  }

  @Put(':id')
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(UploadFileS3('image'))
  update(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/(jpg|png|jpeg|webp)' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto, image);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.categoryService.remove(slug);
  }
}
