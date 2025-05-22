import { ExchangeRateApiResponse, ExchangeRates } from '@src/types/types';
import { Logger } from './Logger';

export class ExchangeApiService {
  private apiKey: string;
  constructor() {
    this.apiKey = process.env.EXCHANGE_API_KEY || '';
  }

  async fetchRates(source?: string) {
    let url = `https://api.currencylayer.com/live?access_key=${this.apiKey}`;
    if (source) url += `&source=${source}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request to CurrencyLayer API: ${response.status}-${response.statusText}`);
    }

    console.log(response);
    Logger.log(`API response: ${JSON.stringify(response)}`);

    const data = (await response.json()) as ExchangeRateApiResponse;

    return data;
  }

  async getExchangeRates(currencyPair: string): Promise<string> {
    const [from, to] = currencyPair.split('-');
    try {
      const data = await this.fetchRates(from);

      const rate = this.convertCurrency(data.quotes, from, to);

      const formattedRate = this.formatCurrency(rate, to);

      return `Текущий курс ${from} к ${to}: ${formattedRate}`;
    } catch (error) {
      Logger.error(`${error}`);
      return 'Ой! Что-то пошло не так. Убедитесь, что вы ввели валютную пару в формате USD-EUR, или попробуйте позже.';
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
