import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import {
  CreateSupplierDto,
  LoginSupplierDto,
  SupplimentaryInformationDto,
  UploadDocsDto,
} from './dto/create-supplier.dto';
import { CheckOtpDto } from '../auth/dto/otp.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes';
import { SupplierAuthGuard } from './guard/supplier-auth.guard';
import { UploadFileFieldsS3 } from 'src/common/interceptors/upload-file.interceptor';
import { DocumentsType } from './types/doc.type';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post('signup')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  supplierSignup(@Body() signupDto: CreateSupplierDto) {
    return this.supplierService.supplierSingup(signupDto);
  }

  @Post('login')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  loginSupplier(@Body() loginSupplier: LoginSupplierDto) {
    return this.supplierService.loginSupplier(loginSupplier);
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

  @Post('upload-documents')
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(
    UploadFileFieldsS3([
      { name: 'acceptedDoc', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  @UseGuards(SupplierAuthGuard)
  @ApiBearerAuth('Authorization')
  uploadDocuments(
    @Body() docsDto: UploadDocsDto,
    @UploadedFiles() files: DocumentsType,
  ) {
    return this.supplierService.uploadDocuments(files);
  }
}
