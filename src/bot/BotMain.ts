import { Logger } from '../services/Logger';
import { BotProvider } from '../types/BotTypes';

export class BotMain {
  private provider: BotProvider;

  constructor(provider: BotProvider) {
    this.provider = provider;
  }

  async sendMessage(chatId: string, text: string): Promise<void> {
    await this.provider.sendMessage(chatId, text);
  }

  async start(): Promise<void> {
    await this.provider.onMessage((message: string) => {
      Logger.log(`Received message: ${message}`);
    });
  }
}
