import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { BasketService } from '../basket/basket.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from '../basket/entity/basket.entity';
import { PaymentController } from './payment.controller';
import { MenuModule } from '../menu/menu.module';
import { DiscountModule } from '../discount/discount.module';
import { HTTPApiModule } from '../http/http.module';

@Module({
  imports: [
    AuthModule,
    HTTPApiModule,
    MenuModule,
    DiscountModule,
    TypeOrmModule.forFeature([BasketEntity]),
  ],
  providers: [PaymentService, BasketService],
  controllers: [PaymentController],
})
export class PaymentModule {}
