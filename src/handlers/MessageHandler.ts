import { isCurrencyPairValid } from '../utils';
import { Logger } from '../services/Logger';
import { ExchangeApiService } from '../services/ExchangeApiService';

export class MessageHandler {
  private exchangeApiService: ExchangeApiService;
  constructor() {
    this.exchangeApiService = new ExchangeApiService();
  }

  async handleMessage(message: string): Promise<string> {
    Logger.log(`Received message: ${message}`);

    if (isCurrencyPairValid(message)) {
      const rateMessage = await this.exchangeApiService.fetchExchangeRates(message);
      return rateMessage;
    }

    return 'Вы ввели некорректную валютную пару. Введите валютную пару в формате USD-EUR.';
  }
}
