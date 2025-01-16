import { Controller, Delete, Get, Post } from '@nestjs/common';
import { BasketService } from './basket.service';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  addToBasket() {}

  @Get()
  getBasket() {}

  @Delete()
  removeFromBasket() {}
}
