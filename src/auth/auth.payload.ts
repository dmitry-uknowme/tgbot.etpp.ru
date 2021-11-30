export class LoginProfilePayload {
  username: string;
  chat_id: string;
  tg_id: string;
}

export class AddAuthPayload {
  chat_id: string;
  tg_id: string;
  refresh_token: string;
}
