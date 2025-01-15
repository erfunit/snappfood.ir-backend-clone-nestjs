import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { CategoryModule } from '../category/category.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig()), AuthModule, CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
