import { Logger } from '@src/services/Logger';
import { BotProvider, IncomingMessage, TgMessage, TgUpdateResponse } from '@src/types/types';

export class TelegramProvider implements BotProvider {
  private TG_URL: string;
  private token: string;
  private stopped = false;
  private retryDelay = 3000;

  constructor(token: string) {
    this.token = token;
    this.TG_URL = `https://api.telegram.org/bot${this.token}`;
  }

  async sendMessage(chatId: number, text: string): Promise<void> {
    const url = `${this.TG_URL}/sendMessage`;
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
    while (!this.stopped) {
      try {
        const url = `${this.TG_URL}/getUpdates?offset=${offset}&allowed_updates=["message"]`;
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
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        Logger.error(`Error while getting updates: ${message}`);
        if (this.stopped) return;

        Logger.log(`Retrying in ${this.retryDelay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, this.retryDelay));
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
