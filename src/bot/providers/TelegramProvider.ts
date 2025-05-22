import { BotProvider, IncomingMessage, TgMessage, TgUpdateResponse } from '@src/types/types';

export class TelegramProvider implements BotProvider {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async sendMessage(chatId: number, text: string): Promise<void> {
    const url = `https://api.telegram.org/bot${this.token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'html',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
  }

  // TODO: перезапускать бота при ошибке
  async onMessage(callback: (message: IncomingMessage) => void): Promise<void> {
    let offset = 0;
    while (true) {
      const url = `https://api.telegram.org/bot${this.token}/getUpdates?offset=${offset}&&allowed_updates=["message"]`;
      const response = await fetch(url);
      const data = (await response.json()) as TgUpdateResponse;

      if (!data.ok) {
        throw new Error(`Failed to get updates: ${data.description}`);
      }

      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          const message = this.parseMessage(update.message);
          callback(message);
          offset = update.update_id + 1;
        }
      }
    }
  }

  private parseMessage(message: TgMessage): IncomingMessage {
    return {
      chatId: message.chat.id,
      text: message.text || '',
      messageId: message.message_id,
      timestamp: new Date(message.date * 1000),
      user: {
        id: message.from?.id || 0,
        username: message.from?.username,
      },
    };
  }
}
