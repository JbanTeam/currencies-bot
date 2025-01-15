import { Logger } from './Logger';

export class ExchangeApiService {
  private apiKey: string;
  constructor() {
    this.apiKey = process.env.EXCHANGE_API_KEY || '';
  }

  async fetchExchangeRates(currencyPair: string): Promise<string> {
    const [from, to] = currencyPair.split('-');
    const url = `https://api.exchangeratesapi.io/v1/latest?access_key=${this.apiKey}`;
    // В бесплатной версии ExchangeRatesApi доступен только один endpoint с курсами относительно базовой валюты - EUR, поэтому приходится делать вычисления
    // const url = `https://api.exchangeratesapi.io/v1/convert?access_key=${this.apiKey}&from=${from}&to=${to}&amount=1`; // - в платной версии;
    // const url = `https://api.exchangeratesapi.io/v1/convert?access_key=${this.apiKey}&base=${from}&sybmols=${to}`; // - в платной версии;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка при запросе к API: ${response.status}-${response.statusText}`);
      }

      const data = await response.json();
      Logger.log(`Received exchange rates: ${JSON.stringify(data)}`);

      const fromRate = data.rates[from];
      const toRate = data.rates[to];

      if (!fromRate || !toRate) {
        return 'Валютная пара не найдена.';
      }

      const rate = (toRate / fromRate).toFixed(2);

      return `Текущий курс ${from} к ${to}: ${rate}.`;
    } catch (error) {
      Logger.error(`${error}`);
      return 'Ой! Что-то пошло не так. Убедитесь, что вы ввели валютную пару в формате USD-EUR, или попробуйте позже.';
    }
  }
}
