import { BotMain } from './BotMain';
import { TelegramProvider } from './providers/telegram/TelegramProvider';

export class BotManager {
  private bots: BotMain[] = [];

  constructor() {
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN || '';

    if (!telegramToken) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set');
    }

    const telegramProvider = new TelegramProvider(telegramToken);

    this.bots.push(new BotMain(telegramProvider));
  }

  async start(): Promise<void> {
    for (const bot of this.bots) {
      await bot.start();
    }
  }
}
