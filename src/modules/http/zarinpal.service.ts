import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class ZarinpalService {
  constructor(private readonly httpService: HttpService) {}

  async sendRequest(data?: {
    amount: number;
    description: string;
    user: { email: string; mobile: string };
  }) {
    const { amount, description, user } = data;
    const options = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: amount * 10,
      description,
      metadata: {
        mobile: user?.mobile ?? '',
        email: user?.email ?? '',
      },
      callback_url: 'http://localhost:3000/payment/verify',
    };
    const result: any = await lastValueFrom(
      this.httpService
        .post(process.env.ZARINPAL_REQUEST_URL, options, {})
        .pipe(map((res) => res.data))
        .pipe(
          catchError((err) => {
            console.log(err);
            throw new InternalServerErrorException('zarinap error');
          }),
        ),
    );
    const { authority, code } = result.data;
    if (code == 100 && authority) {
      return {
        code,
        authority,
        gatewayUrl: `${process.env.ZARINPAL_GATEWAY_URL}${authority}`,
      };
    }
    throw new InternalServerErrorException('Connection failed in zarinpal');
  }

  async verifyRequest(data?: any) {
    const option = {
      authority: data.authority,
      amount: data.amount * 10,
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
    };
    this.httpService.post(process.env.ZARINPAL_VERIFY_URL, data, {});

    const result = await lastValueFrom(
      this.httpService
        .post(process.env.ZARINPAL_VERIFY_URL, option, {})
        .pipe(map((res) => res.data))
        .pipe(
          catchError((err) => {
            console.log(err);
            throw new InternalServerErrorException('zarinpal failed');
          }),
        ),
    );
    return result;
  }
}
