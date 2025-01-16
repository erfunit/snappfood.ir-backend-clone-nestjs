import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketEntity } from './entity/basket.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity)
    private readonly basketService: Repository<BasketEntity>,
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  async addToBasket() {}
  async removeFromBasket() {}
  async getBasket() {}
  async addDiscount() {}
  async removeDiscount() {}
}
