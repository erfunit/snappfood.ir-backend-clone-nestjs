import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HTTPApiService {
  constructor(private readonly httpService: HttpService) {}

  async sendRequest(data?: any) {
    this.httpService.post(process.env.ZARINPAL_REQUEST_URL, data, {});
  }

  async verifyRequest(data?: any) {
    this.httpService.post(process.env.ZARINPAL_VERIFY_URL, data, {});
  }
}
