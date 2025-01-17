import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';

@Controller('payment')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  getGatewayUrl(@Body() paymentDto: PaymentDto) {
    return this.paymentService.getGatewayUrl(paymentDto);
  }
}
