import { HttpModule, HttpService } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { HTTPApiService } from './http.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
      timeout: 5000,
    }),
  ],
  providers: [HttpService, HTTPApiService],
  exports: [HttpService, HTTPApiService],
})
export class HTTPApiModule {}
