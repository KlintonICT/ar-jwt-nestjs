import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { TTokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/signup')
  signupLocal(@Body() dto: AuthDto): Promise<TTokens> {
    return this.authService.signupLocal(dto);
  }

  @Post('/local/sign-in')
  signInLocal(@Body() dto: AuthDto): Promise<TTokens> {
    return this.authService.signInLocal(dto);
  }

  @Post('/logout')
  logout() {
    return this.authService.logout();
  }

  @Post('/refresh')
  refreshTokens() {
    return this.authService.refreshTokens();
  }
}
