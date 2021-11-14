import * as TelegramBot from 'node-telegram-bot-api';

import { Injectable } from '@nestjs/common';

@Injectable()
export class ConnectionService {
  constructor() {
    this.init();
  }
  init() {
    const token = process.env.BOT_TOKEN;
    const bot = new TelegramBot(token, { polling: true });
    bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, 'Салам');
    });
  }
}
