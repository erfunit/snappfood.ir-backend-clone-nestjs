import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { TypeService } from './service/type.service';
import { FeedbackService } from './service/feedback.service';
import { MenuService } from './service/menu.service';

@Module({
  controllers: [MenuController],
  providers: [MenuService, TypeService, FeedbackService],
})
export class MenuModule {}
