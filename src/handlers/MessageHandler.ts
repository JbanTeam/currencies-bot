import { BotError } from '@src/errors/BotError';
import { ExchangeApiService } from '../services/ExchangeApiService';
import { Logger } from '@src/services/Logger';

export class MessageHandler {
  private exchangeApiService: ExchangeApiService;
  constructor(exchangeApi: ExchangeApiService) {
    this.exchangeApiService = exchangeApi;
  }

  async handleMessage(message: string): Promise<string> {
    try {
      const rateMessage = await this.exchangeApiService.getExchangeRates(message);
      return rateMessage;
    } catch (error) {
      Logger.error(error);
      if (error instanceof BotError) {
        return error.userMessage;
      }
      return 'Ошибка получения курса. Убедитесь, что вы ввели валютную пару из списка в формате USD-EUR, или попробуйте позже.';
    }
  }
}
