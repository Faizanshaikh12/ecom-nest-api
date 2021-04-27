import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../shared/user.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('login')
  async login(@Body() userDto: LoginDto) {
    return await this.userService.findByLogin(userDto);
  }

  @Post('register')
  async register(@Body() userDto: RegisterDto) {
    return await this.userService.create(userDto);
  }
}
