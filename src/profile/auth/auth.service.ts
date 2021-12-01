import { Injectable } from '@nestjs/common';
import { AddAuthPayload } from './auth.payload';
import jwt from 'jsonwebtoken';
import { Auth } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async addAuth(payload: AddAuthPayload) {
    const { chat_id, tg_id, refresh_token } = payload;
    const authModel = this.authRepository.create({
      chat_id,
      tg_id,
      refresh_token,
    });
    await this.authRepository.save(authModel);
    return { token: refresh_token };
  }
}
