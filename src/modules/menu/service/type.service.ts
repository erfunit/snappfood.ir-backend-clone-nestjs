import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuTypeEntity } from '../entities/type.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class TypeService {
  constructor(
    @InjectRepository(MenuTypeEntity)
    private readonly typeRepository: Repository<MenuTypeEntity>,
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  async create(createTypeDto: { title: string }) {
    const { id: supplierId } = this.request.user;
    const type = this.typeRepository.create({
      title: createTypeDto.title,
      supplierId,
    });
    await this.typeRepository.save(type);
    return {
      message: 'type created successfully',
      data: type,
    };
  }

  findAll() {
    return this.typeRepository.find({
      where: {},
      order: { id: 'DESC' },
    });
  }

  async findOneById(id: number) {
    const type = await this.typeRepository.findOneBy({ id });
    if (!type) throw new NotFoundException('menu type not found');
    return type;
  }

  async remove(id: number) {
    await this.findOneById(id);
    await this.typeRepository.delete({ id });
    return {
      message: 'type deleted successfully',
    };
  }
}
