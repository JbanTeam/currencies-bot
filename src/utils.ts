const currencyPairRegex = /^[A-Z]{3}-[A-Z]{3}$/;

export const isCurrencyPairValid = (currencyPair: string): boolean => currencyPairRegex.test(currencyPair);
