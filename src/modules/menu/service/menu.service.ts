import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { FoodDto } from '../dto/food.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from '../entities/menu.entity';
import { Repository } from 'typeorm';
import { MenuTypeService } from './type.service';
import { S3Service } from 'src/modules/s3/s3.service';
import { MenuTypeEntity } from '../entities/type.entity';

@Injectable({ scope: Scope.REQUEST })
export class MenuService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    @InjectRepository(MenuTypeEntity)
    private readonly menuTypeRepository: Repository<MenuTypeEntity>,
    private readonly typeService: MenuTypeService,
    private readonly s3Service: S3Service,
  ) {}

  async create(foodDto: FoodDto, image: Express.Multer.File) {
    const { id: supplierId } = this.request.user;
    const { title, description, price, discount, typeId } = foodDto;
    const type = await this.typeService.findOneById(typeId);
    const { Location, Key } = await this.s3Service.updloadFile(
      image,
      'menu-item',
    );
    const item = this.menuRepository.create({
      typeId: type.id,
      supplierId,
      title,
      description,
      price,
      image: Location,
      imageKey: Key,
      discount,
    });

    await this.menuRepository.save(item);
    return {
      message: 'new item created successfully',
      data: item,
    };
  }

  async getFullMenu(supplierId: number) {
    return this.menuTypeRepository.find({
      where: { supplierId },
      relations: {
        menu: true,
      },
    });
  }

  async getOne(id: number) {
    const food = await this.menuRepository.findOneBy({ id });
    if (!food) throw new NotFoundException('food not found');
    return food;
  }
}
