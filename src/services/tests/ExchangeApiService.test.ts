import { BotError } from '@src/errors/BotError';
import { ExchangeApiService } from '../ExchangeApiService';

describe('ExchangeApiService', () => {
  let service: ExchangeApiService;
  const base_url = 'https://api.currencylayer.com/live';
  const full_url = `${base_url}?access_key=${process.env.EXCHANGE_API_KEY || ''}`;

  beforeEach(() => {
    service = new ExchangeApiService();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch exchange rates successfully', async () => {
    const mockResponse = {
      quotes: {
        USDEUR: 0.83,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const rates = await service.fetchRates();

    expect(global.fetch).toHaveBeenCalledWith(full_url);
    expect(rates).toEqual(mockResponse);
  });

  it('should throw an error if fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({}),
    });

    await expect(service.fetchRates()).rejects.toThrow('Error fetching rates: 500-Internal Server Error');
  });

  it('should return exchange rate for a valid currency pair', async () => {
    const mockResponse = {
      quotes: {
        USDEUR: 0.83,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await service.getExchangeRates('USD-EUR');
    expect(result).toBe('Текущий курс USD-EUR: $0.83');
  });

  it('should return an error for not exist currency pair', async () => {
    const mockResponse = {
      quotes: {
        USDEUR: 0.83,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await expect(service.getExchangeRates('USD-YYY')).rejects.toThrow(BotError);
  });

  it('should return an error for invalid currency pair', async () => {
    const mockResponse = {
      quotes: {
        USDEUR: 0.83,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await expect(service.getExchangeRates('USD-invalid')).rejects.toThrow(BotError);
  });
});
