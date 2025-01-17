import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BasketService } from '../basket/basket.service';
import { ZarinpalService } from '../http/zarinpal.service';
import { OrderService } from '../order/order.service';
import { PaymentDataDto, PaymentDto } from './dto/payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/patment.entity';
import { Repository } from 'typeorm';

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
    if (!payment.status)
      return this.zarinpalService.sendRequest({
        amount: basket.payment_amount,
        description: 'snappfood backend clone zarinpal gateway',
        user: {
          mobile,
          email,
        },
      });
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
}
