import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { RegisterProfilePayload } from './profile.payload';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}
  getProfiles() {
    return this.profileRepository.find();
  }

  async addProfile(payload: RegisterProfilePayload) {
    const {
      tg_user_id,
      tg_chat_id,
      tg_user_username,
      tg_user_first_name,
      platform_email,
      platform_password,
    } = payload;

    if (platform_password === '123') {
      const profileModel = this.profileRepository.create({
        tg_user_id,
        tg_chat_id,
        tg_user_username,
        tg_user_first_name,
        platform_email,
        current_role: Math.random() > 0.5 ? 'ORGANIZER' : 'PARTICIPANT',
      });
      await this.profileRepository.save(profileModel);
    }
  }
}
