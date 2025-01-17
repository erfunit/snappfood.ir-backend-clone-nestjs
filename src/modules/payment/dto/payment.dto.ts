import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaymentDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;
}

export class PaymentDataDto {
  amount: number;
  invoice_number: string;
  orderId: number;
  status: boolean;
}

export class VerifyPaymentDto {
  Authority: string;
  Status: 'OK' | 'NOK';
}
