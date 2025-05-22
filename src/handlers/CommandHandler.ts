import { Logger } from '../services/Logger';
import { ExchangeApiService } from '../services/ExchangeApiService';
import { currencyMessage, helpMessage, startMessage } from '@src/constants';

export class CommandHandler {
  private exchangeApi: ExchangeApiService;
  constructor(exchangeApi: ExchangeApiService) {
    this.exchangeApi = exchangeApi;
  }

  async handleCommand(command: string): Promise<string> {
    Logger.log(`Received command: ${command}`);

    switch (command) {
      case '/start':
        return startMessage;
      case '/help':
        return helpMessage;
      case '/currency':
        try {
          const data = await this.exchangeApi.fetchRates();
          const currencies = Object.keys(data.quotes).map(key => key.slice(3));
          return `${currencyMessage} ${currencies.join(', ')}`;
        } catch (error) {
          Logger.error(error);
          return 'Сорян! Что-то пошло не так. Попробуйте позже.';
        }
      default:
        return 'Неизвестная команда. Попробуйте /help.';
    }
  }
}
