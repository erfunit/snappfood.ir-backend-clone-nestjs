import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BasketService } from '../basket/basket.service';
import { ZarinpalService } from '../http/zarinpal.service';
import { OrderService } from '../order/order.service';
import {
  PaymentDataDto,
  PaymentDto,
  VerifyPaymentDto,
} from './dto/payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/patment.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from 'src/common/enums/order-status.enum';

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly basketService: BasketService,
    private readonly zarinpalService: ZarinpalService,
    private readonly orderService: OrderService,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async getGatewayUrl(paymentDto: PaymentDto) {
    const { mobile, email } = this.request.user;
    const basket = await this.basketService.getBasket();
    const order = await this.orderService.create(basket);
    await this.orderService.create(basket, paymentDto.description);
    const payment = await this.create({
      amount: basket.payment_amount,
      orderId: order.id,
      status: basket.payment_amount === 0,
      invoice_number: new Date().getTime().toString(),
    });
    if (!payment.status) {
      const { authority, code, gatewayUrl } =
        await this.zarinpalService.sendRequest({
          amount: basket.payment_amount,
          description: 'snappfood backend clone zarinpal gateway',
          user: {
            mobile,
            email,
          },
        });
      payment.authority = authority;
      await this.paymentRepository.save(payment);
      return {
        code,
        gatewayUrl,
      };
    }
    return {
      message: 'payment successfull',
    };
  }

  async create({ amount, invoice_number, orderId }: PaymentDataDto) {
    const { id: userId } = this.request.user;
    const payment = this.paymentRepository.create({
      amount,
      invoice_number,
      orderId,
      status: false,
      userId,
    });
    await this.paymentRepository.save(payment);
    return payment;
  }

  async verify({ Status, Authority }: VerifyPaymentDto) {
    const payment = await this.paymentRepository.findOneBy({
      authority: Authority,
    });
    if (!payment || payment.status)
      throw new NotFoundException('No payment info found');
    if (Status === 'OK') {
      payment.status = true;
      const order = await this.orderService.findOne(payment.orderId);
      order.status = OrderStatus.Paid;
      await this.orderService.save(order);
    } else {
      return `https://frontendurl.com/payment-result?status=failed&id=${payment.id}`;
    }
    await this.paymentRepository.save(payment);
    return `https://frontendurl.com/payment-result?status=success&id=${payment.id}`;
  }
}
