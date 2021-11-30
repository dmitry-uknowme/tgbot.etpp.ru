import { Injectable } from '@nestjs/common';
import { AddAuthPayload, LoginProfilePayload } from './auth.payload';
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
    console.log('pyload', payload);
    const authModel = await this.authRepository.create({
      chat_id,
      tg_id,
      refresh_token,
    });

    return await this.authRepository.save(authModel);
    // console.log(
    //   'rep',
    //   this.authRepository.create({
    //     chat_id,
    //     tg_id,
    //     refresh_token,
    //   }),
    // );
  }
  // loginProfile(payload: LoginProfilePayload) {
  //   const { chatId, tgId, username } = payload;
  //   const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  //   // console.log('tok', token);

  //   //   const
  // }
}
