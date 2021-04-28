import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../shared/user.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Payload } from "../types/payload";

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  tempAuth() {
    return { auth: 'works' };
  }

  @Post('login')
  async login(@Body() userDto: LoginDto) {
    const user = await this.userService.findByLogin(userDto);
    const payload: Payload = {
      username: user.username,
      seller: user.seller,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('register')
  async register(@Body() userDto: RegisterDto) {
    const user = await this.userService.create(userDto);
    const payload: Payload = {
      username: user.username,
      seller: user.seller,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
}
