import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { LoginProfilePayload } from './auth.payload';
import { AuthService } from './auth.service';
import { sign, verify } from 'jsonwebtoken';
import { Request, Response } from 'express';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async loginProfile(
    @Req() request: Request & { cookies: { [key: string]: string } },
    @Res({ passthrough: true })
    response: Response & { cookies: { [key: string]: string } },
    @Body() payload: LoginProfilePayload,
  ): Promise<any> {
    const { chat_id, tg_id } = payload;
    const accessToken = sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '10h',
    });
    const refreshToken = sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '30d',
    });
    console.log(
      'coooookk',
      request.cookies['access_token'],
      request.cookies['refresh_token'],
    );
    response.cookie('access_token', accessToken, {
      maxAge: 900000,
      httpOnly: true,
    });

    response.cookie('refresh_token', refreshToken, {
      maxAge: 900000,
      httpOnly: true,
    });

    // console.log(
    //   'coooookkafter',
    //   response.cookies['access_token'],
    //   response.cookies['refresh_token'],
    // );

    if (
      request.cookies['access_token'] &&
      request.cookies['refresh_token'] &&
      verify(request.cookies['access_token'], process.env.JWT_SECRET_KEY) &&
      verify(request.cookies['refresh_token'], process.env.JWT_SECRET_KEY)
    ) {
      return 'Error! Already logged in';
    }
    await this.authService.addAuth({
      chat_id,
      tg_id,
      refresh_token: refreshToken,
    });
  }

  @Post('/logout')
  logoutProfile(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() payload: LoginProfilePayload,
  ): any {
    response.clearCookie('refresh_token');
    response.clearCookie('access_token');

    if (!request.cookies['access_token'] || !request.cookies['refresh_token']) {
      return 'Error! Not logged in';
    }
    return { res: request.cookies };
  }

  @Post('/check')
  checkAuth(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() payload: { token: string },
  ) {
    const token = request.cookies['access_token'];
    console.log('tknnn', token);
    console.log('ckkckckckck', request.cookies);
    // const { token } = payload;
    // console.log(
    //   'tokennnnnnn',
    //   request.cookies['access_token'],
    //   request.cookies['refresh_token'],
    // );

    if (!token) {
      return ' no token';
    }

    try {
      verify(token, process.env.JWT_SECRET_KEY);
      return { valid: true };
    } catch {
      // response.clearCookie('refresh_token');
      // response.clearCookie('access_token');
      return { valid: false };
    }
  }
}
