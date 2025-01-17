import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from './entity/basket.entity';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { MenuEntity } from '../menu/entities/menu.entity';
import { MenuTypeEntity } from '../menu/entities/type.entity';
import { MenuModule } from '../menu/menu.module';
import { AuthModule } from '../auth/auth.module';
import { DiscountEntity } from '../discount/entity/discount.entity';
import { DiscountService } from '../discount/discount.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BasketEntity,
      MenuEntity,
      MenuTypeEntity,
      DiscountEntity,
    ]),
    MenuModule,
    AuthModule,
  ],
  controllers: [BasketController],
  providers: [BasketService, DiscountService],
})
export class BasketModule {}
