const cryptocompare = require('cryptocompare');

export const getEtherPriceInCurrency = async (currency: 'USD' | 'EUR' | 'GBP'): Promise<string> => {
  const priceInCurrency = await cryptocompare.price('ETH', currency);
  return priceInCurrency[currency];
};
