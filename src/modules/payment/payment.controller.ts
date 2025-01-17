import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PaymentDto, VerifyPaymentDto } from './dto/payment.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  getGatewayUrl(@Body() paymentDto: PaymentDto) {
    return this.paymentService.getGatewayUrl(paymentDto);
  }

  @Get('/verify')
  async verifyPayment(
    @Query() verifyDto: VerifyPaymentDto,
    @Res() response: Response,
  ) {
    const url = await this.paymentService.verify(verifyDto);
    response.redirect(url);
  }
}
