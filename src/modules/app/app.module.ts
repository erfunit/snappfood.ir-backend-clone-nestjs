import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { CategoryModule } from '../category/category.module';
import { AuthModule } from '../auth/auth.module';
import { SupplierModule } from '../supplier/supplier.module';
import { MenuModule } from '../menu/menu.module';
import { DiscountModule } from '../discount/discount.module';
import { BasketModule } from '../basket/basket.module';
import { PaymentModule } from '../payment/payment.module';
import { HTTPApiModule } from '../http/http.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    HTTPApiModule,
    AuthModule,
    CategoryModule,
    SupplierModule,
    MenuModule,
    DiscountModule,
    BasketModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
