import * as querystring from 'querystring';

import { Logger } from './Logger';
import { isCurrencyPairValid } from '@src/utils';
import { BotError } from '@src/errors/BotError';
import { ExchangeRateApiResponse, ExchangeRates } from '@src/types/types';

export class ExchangeApiService {
  private apiKey: string;
  private baseUrl: string;
  constructor() {
    this.apiKey = process.env.EXCHANGE_API_KEY || '';
    this.baseUrl = process.env.EXCHANGE_API_BASE_URL || '';
  }

  async fetchRates(currencyPair?: string) {
    try {
      const query = querystring.stringify({
        access_key: this.apiKey,
      });

      let url = `${this.baseUrl}?${query}`;
      let pairStr = '';

      if (currencyPair) {
        const [from, to] = currencyPair.split('-');
        url += `&source=${from}`;
        pairStr = `: ${from}-${to}`;
      }

      Logger.log(`Request to ${this.baseUrl}${pairStr}`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new BotError(
          `Error fetching rates: ${response.status}-${response.statusText}`,
          'Ошибка получения курса',
          400,
        );
      }

      Logger.log(`API response:`, response);

      const data = (await response.json()) as ExchangeRateApiResponse;

      return data;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async getExchangeRates(currencyPair: string): Promise<string> {
    const [from, to] = currencyPair.split('-');

    if (!isCurrencyPairValid(currencyPair)) {
      throw new BotError(
        `Invalid currency pair`,
        'Вы ввели некорректную валютную пару. Введите валютную пару в формате USD-EUR.',
        400,
      );
    }

    const data = await this.fetchRates(currencyPair);

    const rate = this.convertCurrency(data.quotes, from, to);

    const formattedRate = this.formatCurrency(rate, from);

    return `Текущий курс ${from}-${to}: ${formattedRate}`;
  }

  private convertCurrency(quotes: ExchangeRates, fromCurrency: string, toCurrency: string, amount: number = 1): number {
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();

    if (fromCurrency === toCurrency) return amount;

    const rate = quotes[`${fromCurrency}${toCurrency}`];

    if (!rate) {
      throw new BotError(
        `Invalid currency pair`,
        'Вы ввели некорректную валютную пару. Введите валютную пару в формате USD-EUR.',
        400,
      );
    }

    return rate * amount;
  }

  private formatCurrency(value: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  }
}
