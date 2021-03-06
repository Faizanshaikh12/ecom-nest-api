import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../types/user';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto, RegisterDto } from '../auth/auth.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from '../types/payload';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  private sanitizeUser(user: User) {
    return user.depopulate('password');
  }

  async create(userDto: RegisterDto) {
    const { username } = userDto;
    const user = await this.userModel.findOne({ username });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.userModel(userDto);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async findByLogin(userDto: LoginDto) {
    const { username, password } = userDto;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new HttpException('Invalid Details', HttpStatus.UNAUTHORIZED);
    }

    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('Invalid Details', HttpStatus.UNAUTHORIZED);
    }
  }

  async findByPayload(payload: Payload) {
    const { username } = payload;
    return await this.userModel.findOne({ username });
  }
}
