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
        return `Привет! Я помогу вам узнать текущие курсы валют.
Напишите /currency для получения списка доступных валют.`;
      case '/help':
        return 'Доступные команды: /start, /help, /currency.';
      case '/currency':
        try {
          const data = await this.exchangeApi.fetchRates();
          return `Введите валютную пару в формате <b><u>USD-EUR</u></b>, чтобы узнать курс обмена.\n
<b><u>Доступные валюты:</u></b> ${Object.keys(data.rates).join(', ')}`;
        } catch (error) {
          return 'Сорян! Что-то пошло не так. Попробуйте позже.';
        }
      default:
        return 'Неизвестная команда. Попробуйте /help.';
    }
  }
}
