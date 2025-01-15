import { parse } from 'path';
import { BotProvider, IncomingMessage } from '../../types/BotTypes';

export class TelegramProvider implements BotProvider {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async sendMessage(chatId: string, text: string): Promise<void> {
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

  async onMessage(callback: (message: IncomingMessage) => void): Promise<void> {
    let offset = 0;
    while (true) {
      const url = `https://api.telegram.org/bot${this.token}/getUpdates?offset=${offset}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.ok) {
        throw new Error(`Failed to get updates: ${data.description}`);
      }

      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          const message: IncomingMessage = {
            chatId: update.message.chat.id,
            text: update.message.text,
            timestamp: new Date(update.message.date * 1000),
            user: {
              id: update.message.from.id,
              username: update.message.from.username,
            },
          };
          callback(message);
          offset = update.update_id + 1;
        }
      }
    }
  }
}
