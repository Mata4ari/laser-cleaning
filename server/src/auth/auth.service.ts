import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

@Injectable()
export class AuthService {
  private readonly adminCredentials: {
    email: string | undefined;
    password: string | undefined;
  };

  constructor(private jwtService: JwtService) {
    dotenv.config();
    this.adminCredentials = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
    };
  }

  async login(user: { email: string; password: string }) {
    // Проверка учетных данных
    if (
      user.email !== this.adminCredentials.email ||
      user.password !== this.adminCredentials.password
    ) {
      throw new Error('Неверные учетные данные');
    }

    const payload = { email: user.email, sub: 'admin-id' };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}