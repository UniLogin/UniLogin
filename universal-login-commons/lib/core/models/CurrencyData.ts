export type ObservedCurrency = 'USD' | 'EUR' | 'BTC';

export type CurrencyToValue = Record<ObservedCurrency, number>;

export type TokensPrices = Record<string, CurrencyToValue>;
