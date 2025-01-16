import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { S3Service } from '../s3/s3.service';
import { JwtService } from '@nestjs/jwt';
import { SupplierOTPEntity } from './entities/supplier-otp.entity';
import { SupplierDocsEntity } from './entities/supplier-docs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupplierEntity,
      CategoryEntity,
      SupplierOTPEntity,
      SupplierDocsEntity,
    ]),
  ],
  controllers: [SupplierController],
  providers: [SupplierService, CategoryService, S3Service, JwtService],
  exports: [
    TypeOrmModule,
    SupplierService,
    JwtService,
    S3Service,
    CategoryService,
  ],
})
export class SupplierModule {}
