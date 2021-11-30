import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Response,
  Request,
} from '@nestjs/common';
import { LoginProfilePayload } from './auth.payload';
import { AuthService } from './auth.service';
import { sign, verify } from 'jsonwebtoken';
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
      expiresIn: '30m',
    });
    const refreshToken = sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '30d',
    });
    //@ts-expect-error
    response.cookie('access_token', accessToken, {
      maxAge: 9000,
      httpOnly: true,
    });
    //@ts-expect-error
    response.cookie('refresh_token', refreshToken, {
      maxAge: 900000,
      httpOnly: true,
    });

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
    return { res: request.cookies };
  }

  @Post('/logout')
  logoutProfile(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() payload: LoginProfilePayload,
  ): any {
    //@ts-expect-error
    response.clearCookie('refresh_token');
    //@ts-expect-error
    response.clearCookie('access_token');

    //@ts-expect-error
    //remove token
    if (!request.cookies['access_token'] || !request.cookies['refresh_token']) {
      return 'Error! Not logged in';
    }
    //@ts-expect-error
    return { res: request.cookies };
  }
}
