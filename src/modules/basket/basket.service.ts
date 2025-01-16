import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketEntity } from './entity/basket.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { AddToBasketDto } from './dto/basket.dto';
import { MenuService } from '../menu/service/menu.service';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity)
    private readonly basketRepository: Repository<BasketEntity>,
    @Inject(REQUEST)
    private readonly request: Request,
    private menuService: MenuService,
  ) {}

  async addToBasket({ foodId }: AddToBasketDto) {
    const { id: userId } = this.request.user;
    await this.menuService.getOne(foodId);
    let basket = await this.basketRepository.findOne({
      where: { foodId, userId },
    });
    if (basket) {
      basket.count += 1;
    } else {
      basket = await this.basketRepository.create({
        userId,
        foodId,
        count: 1,
      });
    }
    await this.basketRepository.save(basket);
    return {
      message: 'food added to your basket',
    };
  }

  async removeFromBasket() {}

  async getBasket() {}

  async addDiscount() {}

  async removeDiscount() {}
}
