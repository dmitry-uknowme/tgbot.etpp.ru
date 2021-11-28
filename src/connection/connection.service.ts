import * as TelegramBot from 'node-telegram-bot-api';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ConnectionService {
  constructor() {
    this.init();
  }
  init() {
    const token = process.env.BOT_TOKEN;

    const bot = new TelegramBot(token, { polling: true });
    bot.setMyCommands([
      { command: '/start', description: 'Начать' },
      { command: '/help', description: 'Доступные команды' },
    ]);

    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, 'Стартуем', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Активные процедуры',
                callback_data: JSON.stringify({
                  type: 'GET_PROCEDURE_LIST',
                  payload: { page: 1, limit: 10 },
                }),
              },
              {
                text: 'Ваши подписки',
                callback_data: JSON.stringify({
                  type: 'GET_SUBSCRIPTION_LIST',
                }),
              },
            ],
            [
              {
                text: 'Опубликовать процедуру',
                callback_data: JSON.stringify({
                  type: 'ADD_NEW_PROCEDURE',
                }),
              },
            ],
          ],
        },
      });
    });

    bot.onText(/\/clear/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, 'Очистка клавиатуры', {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    });

    bot.on('callback_query', async (query) => {
      const parsedQueryData = JSON.parse(query.data);
      const queryPayload = parsedQueryData.payload;
      const queryType = parsedQueryData.type;
      const chatId = query.message.chat.id;
      // console.log('query', queryType, queryPayload, query);

      switch (queryType) {
        case 'GET_PROCEDURE_LIST':
          const { page, limit } = queryPayload;
          console.log('page', page, 'lim', limit);
          const { data } = await axios.get(
            `${process.env.CORE_API_URL}/procedures?page=${page}&limit=${limit}`,
          );
          const procedures = data.data.items;
          const total = data.data.total;
          const textProcedures = decodeURI(
            procedures
              .map(
                ({
                  name,
                  number,
                  status,
                  organizer,
                  customer,
                  total_amount_price,
                  platform,
                  type_translate,
                }) =>
                  `<b>№ ${number}</b> [${
                    status.translate
                  }]\n(${name})\nЗаказчик: ${
                    customer.short_title || organizer.short_title
                  }\nНачальная цена: ${
                    total_amount_price.amount
                      ? total_amount_price.amount + ' ₽'
                      : 'Не предусмотрена'
                  }\nСекция: ${
                    platform.type.translate
                  }\nСпособ проведения: ${type_translate}`,
              )
              .join('\n\n') +
              '\n\nТекущая страница: ' +
              page +
              '\n',
          );

          // const proc = data;

          const proceduresBtns = {
            inline_keyboard: [
              [],
              [
                {
                  text: 'Выбрать процедуру',
                  callback_data: JSON.stringify({
                    type: 'CHOOSE_PROCEDURE',
                    // payload: { page: proc },
                    payload: {
                      allProcedures: procedures.map(({ number }) => number),
                    },
                  }),
                },
              ],
            ],
          };

          if (page > 1) {
            proceduresBtns.inline_keyboard[0].push({
              text: '< Предыдущая страница',
              callback_data: JSON.stringify({
                type: 'GET_PROCEDURE_LIST',
                payload: { page: page - 1, limit },
              }),
            });
          }

          if (page <= total / limit) {
            proceduresBtns.inline_keyboard[0].push({
              text: 'Следующая страница >',
              callback_data: JSON.stringify({
                type: 'GET_PROCEDURE_LIST',
                payload: { page: page + 1, limit },
              }),
            });
          }
          bot.sendMessage(chatId, textProcedures, {
            parse_mode: 'HTML',
            reply_markup: proceduresBtns,
          });
          break;
        case 'CHOOSE_PROCEDURE':
          console.log('dataaa', queryPayload);
        // const { allProcedures } = queryPayload;
        // const choseProceduresBtns = allProcedures.map(({ name, number }) => ({
        //   text: number,
        // }));
        // console.log('choose', choseProceduresBtns);
        default:
      }
    });
  }
}
// Типы подписок:
// Подписка по ключевым словам
// Подписка на новые торги
// Подписка на обновления на площадке

// Функционал
// Посмотреть список процедур -> учавствовать / подписаться на события
// Опубликовать новую процедуру -> форма публикации процедуры
