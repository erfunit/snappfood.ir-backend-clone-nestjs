import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import {
  CreateSupplierDto,
  SupplimentaryInformationDto,
} from './dto/create-supplier.dto';
import { CheckOtpDto } from '../auth/dto/otp.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes';
import { SupplierAuthGuard } from './guard/supplier-auth.guard';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post('signup')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  supplierSignup(@Body() signupDto: CreateSupplierDto) {
    return this.supplierService.supplierSingup(signupDto);
  }

  @Post('check-otp')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  checkOtp(@Body() otpDto: CheckOtpDto) {
    return this.supplierService.checkOtp(otpDto);
  }

  @Post('supplimentary-information')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  @UseGuards(SupplierAuthGuard)
  @ApiBearerAuth('Authorization')
  supplimentaryInformation(@Body() infoDto: SupplimentaryInformationDto) {
    return this.supplierService.saveSupplimentaryInformation(infoDto);
  }
}
