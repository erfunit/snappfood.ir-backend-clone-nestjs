import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { S3Service } from '../s3/s3.service';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File,
  ) {
    if (typeof createCategoryDto.show === 'string')
      createCategoryDto.show =
        createCategoryDto.show === 'true' || createCategoryDto.show === true;

    const { title, show, slug, parentId } = createCategoryDto;
    const category = await this.findOneBySlug(createCategoryDto.slug);
    if (category) throw new ConflictException('category already exists');
    let parent: CategoryEntity = null;
    if (parentId) parent = await this.findOneById(parentId);
    const { Location } = await this.s3Service.updloadFile(
      image,
      'snappfood-categories',
    );
    const newCategory = await this.categoryRepository.create({
      title,
      show,
      slug: slugify(slug),
      image: Location,
      parentId: parent?.id,
    });
    await this.categoryRepository.save(newCategory);
    return {
      message: 'category created successfully',
      data: newCategory,
    };
  }

  async findAll() {
    const [categories, count] = await this.categoryRepository.findAndCount({
      relations: {
        parent: true,
      },
      select: {
        parent: {
          slug: true,
        },
      },
    });
    return {
      data: categories,
      count,
    };
  }

  async findOneById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('category not found');
    return category;
  }

  findOneBySlug(slug: string) {
    return this.categoryRepository.findOneBy({ slug });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
