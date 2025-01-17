import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { AddToBasketDto, DiscountBasketDto } from './dto/basket.dto';
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

  @Post('/discount')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  addDiscount(@Body() discountDto: DiscountBasketDto) {
    return this.basketService.addDiscount(discountDto);
  }

  @Get()
  getBasket() {
    return this.basketService.getBasket();
  }

  @Delete()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  removeFromBasket(@Query() basketDto: AddToBasketDto) {
    return this.basketService.removeFromBasket(basketDto);
  }

  @Delete('/discount')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  removeDiscount(@Query() discountDto: DiscountBasketDto) {
    return this.basketService.removeDiscount(discountDto);
  }
}
