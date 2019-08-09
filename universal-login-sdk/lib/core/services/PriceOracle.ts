export class PriceOracle {
  async getTokenPrice(tokenSymbol: string, currencySymbol: string) {
    if (currencySymbol === 'USD') {
      return Promise.resolve(1405);
    } else if (currencySymbol === 'EUR') {
      return Promise.resolve(1152);
    }
    return Promise.resolve(1000);
  }
}
