import { ExchangeApiService } from '../ExchangeApiService';

describe('ExchangeApiService', () => {
  let service: ExchangeApiService;

  beforeEach(() => {
    service = new ExchangeApiService();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch exchange rates successfully', async () => {
    const mockResponse = {
      rates: {
        USD: 1.2,
        EUR: 1,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const rates = await service.fetchRates();

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.exchangeratesapi.io/v1/latest?access_key=${process.env.EXCHANGE_API_KEY || ''}`,
    );
    expect(rates).toEqual(mockResponse);
  });

  it('should throw an error if fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({}),
    });

    await expect(service.fetchRates()).rejects.toThrow('Request to ExchangeRatesApi: 500-Internal Server Error');
  });

  it('should return exchange rate for a valid currency pair', async () => {
    const mockResponse = {
      rates: {
        USD: 1.2,
        EUR: 1,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await service.getExchangeRates('USD-EUR');
    expect(result).toBe('Текущий курс USD к EUR: 0.83.');
  });

  it('should return an error message for an invalid currency pair', async () => {
    const mockResponse = {
      rates: {
        USD: 1.2,
        EUR: 1,
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await service.getExchangeRates('USD-EUH');
    expect(result).toBe('Валютная пара не найдена.');
  });

  it('should return an error message if fetchRates fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await service.getExchangeRates('USD-EUR');
    expect(result).toBe(
      'Ой! Что-то пошло не так. Убедитесь, что вы ввели валютную пару в формате USD-EUR, или попробуйте позже.',
    );
  });
});
