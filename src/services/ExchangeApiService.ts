import { ExchangeRateApiResponse, ExchangeRates } from '@src/types/types';
import { Logger } from './Logger';
import { isCurrencyPairValid } from '@src/utils';

export class ExchangeApiService {
  private apiKey: string;
  private BASE_URL: string;
  constructor() {
    this.apiKey = process.env.EXCHANGE_API_KEY || '';
    this.BASE_URL = 'https://api.currencylayer.com/live';
  }

  async fetchRates(currencyPair?: string) {
    let url = `${this.BASE_URL}?access_key=${this.apiKey}`;
    let pairStr = '';

    if (currencyPair) {
      const [from, to] = currencyPair.split('-');
      url += `&source=${from}`;
      pairStr = `: ${from}-${to}`;
    }

    Logger.log(`Request to ${this.BASE_URL}${pairStr}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request to CurrencyLayer API: ${response.status}-${response.statusText}`);
    }

    Logger.log(`API response:`, response);

    const data = (await response.json()) as ExchangeRateApiResponse;

    return data;
  }

  async getExchangeRates(currencyPair: string): Promise<string> {
    if (!isCurrencyPairValid(currencyPair)) {
      return 'Вы ввели некорректную валютную пару. Введите валютную пару в формате USD-EUR.';
    }

    const [from, to] = currencyPair.split('-');
    try {
      const data = await this.fetchRates(currencyPair);

      const rate = this.convertCurrency(data.quotes, from, to);

      const formattedRate = this.formatCurrency(rate, from);

      return `Текущий курс ${from}-${to}: ${formattedRate}`;
    } catch (error) {
      Logger.error(error);
      return 'Ошибка получения курса. Убедитесь, что вы ввели валютную пару из списка в формате USD-EUR, или попробуйте позже.';
    }
  }

  private convertCurrency(quotes: ExchangeRates, fromCurrency: string, toCurrency: string, amount: number = 1): number {
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();

    if (fromCurrency === toCurrency) return amount;

    const rate = quotes[`${fromCurrency}${toCurrency}`];

    if (!rate) {
      throw new Error(`Invalid currency pair`);
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
