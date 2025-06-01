import { Logger } from '../services/Logger';
import { telegramCommands } from '@src/constants';
import { CommandStrategy } from '@src/types/types';
import { ExchangeApiService } from '../services/ExchangeApiService';
import { HelpCommand, CurrencyCommand, StartCommand } from '@src/bot/providers/telegram/command-strategies';

export class CommandHandler {
  private strategies: Map<string, CommandStrategy>;
  constructor(exchangeApi: ExchangeApiService) {
    this.strategies = new Map([
      [telegramCommands.START, new StartCommand()],
      [telegramCommands.HELP, new HelpCommand()],
      [telegramCommands.CURRENCY, new CurrencyCommand(exchangeApi)],
    ]);
  }

  async handleCommand(command: string): Promise<string> {
    Logger.log(`Received command: ${command}`);

    const strategy = this.strategies.get(command);

    if (strategy) {
      return await strategy.execute();
    }
    return 'Неизвестная команда. Попробуйте /help.';
  }
}
