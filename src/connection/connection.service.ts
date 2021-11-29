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
      { command: '/clear', description: 'Очистить клавиатуру' },
    ]);

    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(
        chatId,
        // 'Вас приветствует официальный телеграм-бот плошадки ЕТП ТПП. Он создан с целью упрощения работы на площадке',
        'Здравствуйте Вас приветствует тестовая версия телеграм-бота плошадки ЕТП ТПП, созданнный с целью упрощения работы на площадке',
        {
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
        },
      );
    });

    bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, 'Доступные команды: ', {
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
          console.log('from', query.from);
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

          const proceduresBtns = {
            inline_keyboard: [
              [],
              [
                {
                  text: 'Выбрать процедуру',
                  callback_data: JSON.stringify({
                    type: 'CHOOSE_PROCEDURE',
                    payload: { chPage: page, chLimit: limit },
                    // payload: {
                    //   allProcedures: 'procedure',
                    // },
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
          const { chPage, chLimit } = queryPayload;
          const chooseData = await axios.get(
            `${process.env.CORE_API_URL}/procedures?page=${chPage}&limit=${chLimit}`,
          );
          const chooseProceduresBtns = chooseData.data.data.items.map(
            ({ name, number }) => ({
              text: number,
              callback_data: JSON.stringify({ type: 'SECRETTTT' }),
            }),
          );
          bot.sendMessage(chatId, 'Выберите процедуру', {
            reply_markup: { inline_keyboard: [[...chooseProceduresBtns]] },
          });
          break;
        case 'GET_SUBSCRIPTION_LIST':
          bot.sendMessage(
            chatId,
            decodeURI(
              'Подписка по ключевым словам - не найдено\nПодписка на новые торги - не найдено\nПодписка на обновления площадки - не найдено',
            ),
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Оформить подписку',
                      callback_data: JSON.stringify({ type: 'SUBSCRIBE' }),
                    },
                  ],
                ],
              },
            },
          );
          break;
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
