import { Injectable } from '@nestjs/common';
import { LoginProfilePayload } from './auth.payload';
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
  addAuth(chatId: string, tgId: string, refreshToken: string) {
    this.authRepository.create({
      chat_id: chatId,
      tg_id: tgId,
      refresh_token: refreshToken,
    });
  }
  // loginProfile(payload: LoginProfilePayload) {
  //   const { chatId, tgId, username } = payload;
  //   const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  //   // console.log('tok', token);

  //   //   const
  // }
}
