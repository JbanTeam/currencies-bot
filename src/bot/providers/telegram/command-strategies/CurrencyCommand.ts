import { CURRENCY_MESSAGE } from '@src/constants';
import { BotError } from '@src/errors/BotError';
import { CommandStrategy } from '@src/types/types';
import { ExchangeApiService } from '@src/services/ExchangeApiService';

export class CurrencyCommand implements CommandStrategy {
  constructor(private exchangeApi: ExchangeApiService) {}

  async execute(): Promise<string> {
    try {
      const data = await this.exchangeApi.fetchRates();
      const currencies = Object.keys(data.quotes).map(key => key.slice(3));
      return `${CURRENCY_MESSAGE} ${currencies.join(', ')}`;
    } catch (error) {
      if (error instanceof BotError) {
        return error.userMessage;
      }

      return 'Что-то пошло не так. Попробуйте позже.';
    }
  }
}
