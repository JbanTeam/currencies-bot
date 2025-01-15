import { isCurrencyPairValid } from '../utils';
import { Logger } from '../services/Logger';
import { ExchangeApiService } from '../services/ExchangeApiService';

export class MessageHandler {
  private exchangeApiService: ExchangeApiService;
  constructor(exchangeApi: ExchangeApiService) {
    this.exchangeApiService = exchangeApi;
  }

  async handleMessage(message: string): Promise<string> {
    if (isCurrencyPairValid(message)) {
      Logger.log(`Request to exchange rates api: ${message}`);
      const rateMessage = await this.exchangeApiService.getExchangeRates(message);
      return rateMessage;
    }

    return 'Вы ввели некорректную валютную пару. Введите валютную пару в формате USD-EUR.';
  }
}
