import { ExchangeApiService } from '../services/ExchangeApiService';
import { Logger } from '../services/Logger';

export class CommandHandler {
  private exchangeApi: ExchangeApiService;
  constructor(exchangeApi: ExchangeApiService) {
    this.exchangeApi = exchangeApi;
  }

  async handleCommand(command: string): Promise<string> {
    Logger.log(`Received command: ${command}`);

    switch (command) {
      case '/start':
        return `Привет! Я помогу вам узнать текущие курсы валют.\nНапишите /currency для получения списка доступных валют.`;
      case '/help':
        return 'Доступные команды: /start, /help, /currency.';
      case '/currency':
        try {
          const data = await this.exchangeApi.fetchRates();
          const currencies = Object.keys(data.quotes).map(key => key.slice(3));
          return `Введите валютную пару в формате <b><u>USD-EUR</u></b>, чтобы узнать курс обмена.\n<b><u>Доступные валюты:</u></b> ${currencies.join(', ')}`;
        } catch (error) {
          Logger.error(error);
          return 'Сорян! Что-то пошло не так. Попробуйте позже.';
        }
      default:
        return 'Неизвестная команда. Попробуйте /help.';
    }
  }
}
