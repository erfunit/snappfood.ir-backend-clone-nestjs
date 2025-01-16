import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from './entity/basket.entity';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { MenuEntity } from '../menu/entities/menu.entity';
import { MenuTypeEntity } from '../menu/entities/type.entity';
import { MenuModule } from '../menu/menu.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BasketEntity, MenuEntity, MenuTypeEntity]),
    MenuModule,
    AuthModule,
  ],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
