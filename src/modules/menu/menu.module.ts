import { Module } from '@nestjs/common';
import { MenuController } from './controller/menu.controller';
import { MenuTypeService } from './service/type.service';
import { FeedbackService } from './service/feedback.service';
import { MenuService } from './service/menu.service';
import { MenuTypeController } from './controller/type.controller';
import { FeedbackController } from './controller/feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackEntity } from './entities/feedback.entity';
import { MenuEntity } from './entities/menu.entity';
import { MenuTypeEntity } from './entities/type.entity';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackEntity, MenuEntity, MenuTypeEntity]),
    SupplierModule,
  ],
  controllers: [MenuTypeController, MenuController, FeedbackController],
  providers: [MenuService, MenuTypeService, FeedbackService],
  exports: [MenuService, MenuTypeService, TypeOrmModule],
})
export class MenuModule {}
