import { ExchangeApiService } from '../services/ExchangeApiService';

export class MessageHandler {
  private exchangeApiService: ExchangeApiService;
  constructor(exchangeApi: ExchangeApiService) {
    this.exchangeApiService = exchangeApi;
  }

  async handleMessage(message: string): Promise<string> {
    // TODO: fix readme about webhook
    const rateMessage = await this.exchangeApiService.getExchangeRates(message);
    return rateMessage;
  }
}
