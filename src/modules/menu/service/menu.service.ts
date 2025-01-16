import { Inject, Injectable, Scope } from '@nestjs/common';
import { FoodDto } from '../dto/food.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from '../entities/menu.entity';
import { Repository } from 'typeorm';
import { MenuTypeService } from './type.service';
import { S3Service } from 'src/modules/s3/s3.service';

@Injectable({ scope: Scope.REQUEST })
export class MenuService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
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
  }
}
