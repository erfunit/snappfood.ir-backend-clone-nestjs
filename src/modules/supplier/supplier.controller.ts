import { Body, Controller, Post } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post('signup')
  supplierSignup(@Body() signupDto: CreateSupplierDto) {
    return this.supplierService.supplierSingup(signupDto);
  }
}
