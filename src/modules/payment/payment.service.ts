import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BasketService } from '../basket/basket.service';
import { ZarinpalService } from '../http/zarinpal.service';

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly basketService: BasketService,
    private readonly zarinpalService: ZarinpalService,
  ) {}

  async getGatewayUrl() {
    const { mobile, email } = this.request.user;
    const basket = await this.basketService.getBasket();

    return this.zarinpalService.sendRequest({
      amount: basket.payment_amount,
      description: 'snappfood backend clone zarinpal gateway',
      user: {
        mobile,
        email,
      },
    });
  }
}
