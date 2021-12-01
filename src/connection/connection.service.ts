import * as TelegramBot from 'node-telegram-bot-api';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse as parseCookie } from 'set-cookie-parser';

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

    bot.on('message', (msg) => {
      const chatId = msg.chat.id;

      // console.log('url', `http://localhost:5000/api/auth/login`);
    });

    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      // console.log('msg', msg);
      axios('http://localhost:5000/api/auth/check', {
        method: 'post',
        withCredentials: true,
      }).then((res) => {
        console.log(
          'res from check',
          parseCookie(res, {
            decodeValues: true,
          }),
        );
        console.log('isvalid', res.data);
        const isValid = res.data.valid;

        if (isValid) {
          bot.sendMessage(
            chatId,
            decodeURI(
              'Вы авторизованы\nЗдравствуйте Вас приветствует тестовая версия телеграм-бота плошадки ЕТП ТПП, созданнная с целью упрощения работы на площадке',
            ),
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
        } else {
          bot.sendMessage(chatId, 'Вы не авторизованы', {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Авторизоваться',
                    callback_data: JSON.stringify({ type: 'AUTHORIZE' }),
                  },
                ],
              ],
            },
          });
        }
      });
      // bot.sendMessage(
      //   chatId,
      //   // 'Вас приветствует официальный телеграм-бот плошадки ЕТП ТПП. Он создан с целью упрощения работы на площадке',
      //   'Здравствуйте Вас приветствует тестовая версия телеграм-бота плошадки ЕТП ТПП, созданнная с целью упрощения работы на площадке',
      //   {
      //     reply_markup: {
      //       inline_keyboard: [
      //         [
      //           {
      //             text: 'Активные процедуры',
      //             callback_data: JSON.stringify({
      //               type: 'GET_PROCEDURE_LIST',
      //               payload: { page: 1, limit: 10 },
      //             }),
      //           },
      //           {
      //             text: 'Ваши подписки',
      //             callback_data: JSON.stringify({
      //               type: 'GET_SUBSCRIPTION_LIST',
      //             }),
      //           },
      //         ],
      //         [
      //           {
      //             text: 'Опубликовать процедуру',
      //             callback_data: JSON.stringify({
      //               type: 'ADD_NEW_PROCEDURE',
      //             }),
      //           },
      //         ],
      //       ],
      //     },
      //   },
      // );
      // console.log('payload', msg);
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
      const tgId = query.message.from.id;
      // console.log('query', queryType, queryPayload, query);

      switch (queryType) {
        case 'GET_PROCEDURE_LIST':
          console.log('from', query.from);
          const { page, limit } = queryPayload;
          console.log('page', page, 'lim', limit);
          const { data } = await axios.get(
            `${process.env.CORE_API_URL}/procedures?page=${page}&limit=${limit}`,
            { withCredentials: true },
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
                      ? total_amount_price.localized
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
            { withCredentials: true },
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
        case 'AUTHORIZE':
          axios
            .post(
              `http://localhost:5000/api/auth/login`,
              {
                chat_id: chatId,
                tg_id: tgId,
              },
              { withCredentials: true },
            )
            .then((res) => {
              console.log(
                'res of auth',
                parseCookie(res, {
                  decodeValues: true,
                }),
              );
              bot.sendMessage(chatId, 'Вы успешно авторизовались', {
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
