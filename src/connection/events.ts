const events = {
  user: {
    PROFILE: {
      APPROVED: {
        event: 'PROFILE:APPROVED',
        message: (role: string) =>
          `Ваш профиль одобрен одобрен модератором. Вам доступен функционал площадки в качестве ${role}. Роль можно сменить в настройках профиля`,
      },
      REJECTED: {
        event: 'PROFILE:REJECTED',
        message: (mistakes: any[]) =>
          `Ваш профиль отклонен модератором. Пожалуйста исправьте ошибки, перечисленные в уведомлении: ${mistakes.map(
            (mistake) => mistake,
          )} и отправьте повторный запрос на модерацию`,
      },
    },
  },
  participant: {
    PROCEDURE: {
      PUBLISHED: {
        event: 'PROCEDURE:PUBLISHED',
        message: (id: string, title?: string) =>
          `Процедура № ${id} (${title}) опубликована. Примите участие`,
      },
    },
  },
  organizer: {
    PROCEDURE: {
      PUBLISHED: {
        event: 'PROCEDURE:PUBLISHED',
        message: (id: string, title?: string) =>
          `Ваша процеура ${title} успешно опубликована, ей присвоен номер ${id}.`,
      },
    },
    APPLICATION: {
      event: 'APPLICATION:RECIEVED',
      message: (
        procedureId: string,
        procedureTitle: string,
        participantName: string,
      ) =>
        `На вашу процедуру № ${procedureId} (${procedureTitle}) подана заявка от ${participantName}. Ожидает рассмотрения`,
    },
  },
  admin: {
    USER: {
      ON_MODERATION: {
        event: 'USER:ON_MODERATION',
        message: (id: string, title?: string) =>
          `Пользователь № ${id} (${title}) ожидает модерацию профиля`,
      },
      ON_REMODERATION: {
        event: 'USER:ON_REMODERATION',
        message: (id: string, title?: string) =>
          `Пользователь № ${id} (${title}) отправил повторный запрос на модерацию профиля`,
      },
    },
  },
};

export default events;
