import { BotMain } from './BotMain';

export class BotManager {
  private bots: BotMain[] = [];

  constructor() {}

  async start(): Promise<void> {
    for (const bot of this.bots) {
      await bot.start();
    }
  }
}
