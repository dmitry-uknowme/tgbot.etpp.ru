export class LoginProfilePayload {
  chat_id: string;
  tg_id: string;
  username: string;
}

export class AddAuthPayload {
  chat_id: string;
  tg_id: string;
  refresh_token: string;
}
