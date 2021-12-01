import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { RegisterProfilePayload } from './profile.payload';
import { ProfileService } from './profile.service';

@Controller('api/profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('/register')
  registerProfile(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() payload: RegisterProfilePayload,
  ) {
    this.profileService.addProfile(payload);
  }
}
