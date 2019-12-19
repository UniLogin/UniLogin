export type ObservedCurrency = 'USD' | 'ETH' | 'DAI' | 'SAI';

export type CurrencyToValue = Record<ObservedCurrency, number>;

export type TokensPrices = Record<string, CurrencyToValue>;
