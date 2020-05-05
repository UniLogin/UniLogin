import {TokenPricesService, TokenDetails} from '../../../src';
import {expect} from 'chai';

describe('UNIT: TokenPricesService', () => {
  it('Should return empty prices when empty tokenDetails array', async () => {
    const tokenPricesService = new TokenPricesService([]);
    const prices = await tokenPricesService.getPrices();
    expect(prices).be.deep.eq({});
  });

  it('Should return prices for ETH and DAI', async () => {
    const tokenPricesService = new TokenPricesService([{symbol: 'ETH'}, {symbol: 'DAI'}] as TokenDetails[]);
    const prices = await tokenPricesService.getPrices();
    const ethPrices = prices['ETH'];
    expect(ethPrices.ETH).be.eq(1);
    expect(ethPrices.USD).be.greaterThan(0);

    const daiPrices = prices['DAI'];
    expect(daiPrices.ETH).be.greaterThan(0);
    expect(daiPrices.USD).be.greaterThan(0);
  });
});
