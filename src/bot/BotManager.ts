import { BotMain } from './BotMain';
import { TelegramProvider } from './providers/TelegramProvider';

export class BotManager {
  private bots: BotMain[] = [];

  constructor() {
    const telegramProvider = new TelegramProvider(process.env.TELEGRAM_BOT_TOKEN || '');

    this.bots.push(new BotMain(telegramProvider));
  }

  async start(): Promise<void> {
    for (const bot of this.bots) {
      await bot.start();
    }
  }
}
