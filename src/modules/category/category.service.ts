import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { S3Service } from '../s3/s3.service';
import slugify from 'slugify';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import {
  paginationGenerator,
  paginationResolver,
} from 'src/common/pagination/util/pagination.util';

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

    createCategoryDto.slug = slugify(createCategoryDto.slug);
    const { title, show, slug, parentId } = createCategoryDto;
    const category = await this.findOneBySlug(createCategoryDto.slug);
    if (category) throw new ConflictException('category already exists');
    let parent: CategoryEntity = null;
    if (parentId) parent = await this.findOneById(parentId);
    const { Location, Key } = await this.s3Service.updloadFile(
      image,
      'snappfood-categories',
    );
    if (!Location) {
      throw new InternalServerErrorException('Image not uploaded');
    }
    const newCategory = await this.categoryRepository.create({
      title,
      show,
      slug,
      image: Location,
      imageKey: Key,
      parentId: parent?.id,
    });
    await this.categoryRepository.save(newCategory);
    return {
      message: 'category created successfully',
      data: newCategory,
    };
  }

  async findAll(paginationdto: PaginationDto) {
    const { page, limit, skip } = paginationResolver(paginationdto);
    const [categories, count] = await this.categoryRepository.findAndCount({
      relations: {
        parent: true,
      },
      select: {
        parent: {
          slug: true,
        },
      },
      skip,
      take: limit,
    });
    return {
      data: categories,
      pagination: paginationGenerator(count, page, limit),
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

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File,
  ) {
    const category = await this.findOneById(id);
    let { slug, show } = updateCategoryDto;
    const { title, parentId } = updateCategoryDto;
    if (title) {
      category.title = title;
    }
    if (show) {
      if (typeof show === 'string') show = show === 'true' || show === true;
      category.show = show;
    }
    if (slug) {
      slug = slugify(slug);
      const categoryById = await this.findOneBySlug(slug);
      if (categoryById && categoryById.id !== category.id)
        throw new ConflictException('category already exists');
      category.slug = slug;
    }
    if (parentId && !isNaN(parseInt(parentId.toString()))) {
      let parent: CategoryEntity = null;
      if (parentId)
        parent = await this.findOneById(parentId)
          .then((data) => data)
          .catch(() => {
            throw new NotFoundException(
              'category with this parent id not found',
            );
          });
      category.parentId = parent?.id;
    }
    if (image) {
      const { Location, Key } = await this.s3Service.updloadFile(
        image,
        'snappfood-categories',
      );
      if (!Location) {
        throw new InternalServerErrorException('Image not uploaded');
      }
      if (category.imageKey) await this.s3Service.deleteFile(category.imageKey);
      category.image = Location;
      category.imageKey = Key;
    }
    await this.categoryRepository.save(category);
    return {
      message: 'category updated successfully',
      data: category,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
