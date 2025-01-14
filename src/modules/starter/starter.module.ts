import { Module } from '@nestjs/common';
import { StarterService } from './starter.service';
import { StarterController } from './starter.controller';

@Module({
  controllers: [StarterController],
  providers: [StarterService],
})
export class StarterModule {}
