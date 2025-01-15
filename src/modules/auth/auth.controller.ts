import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckOtpDto, SendOtpDto } from './dto/otp.dto';
import { Request } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send-otp')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  sendOtp(@Body() otpDto: SendOtpDto) {
    return this.authService.sendOtp(otpDto);
  }
  @Post('/check-otp')
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  checkOtp(@Body() otpDto: CheckOtpDto) {
    return this.authService.checkOtp(otpDto);
  }

  @Get('/check-auth')
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  checkAuth(@Req() req: Request) {
    return req.user;
  }
}
