import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AddToBasketDto } from './dto/basket.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes';

@Controller('basket')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  addToBasket(@Body() basketDto: AddToBasketDto) {
    return this.basketService.addToBasket(basketDto);
  }

  @Get()
  getBasket() {}

  @Delete()
  removeFromBasket() {}
}
