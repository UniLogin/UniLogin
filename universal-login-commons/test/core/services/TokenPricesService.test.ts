import {TokenPricesService, TokenDetails} from '../../../src';
import {expect} from 'chai';

describe('UNIT: TokenPricesService', () => {
  const ETHPrices = {eth: 1, usd: 213.69};
  const DAIPrices = {eth: 0.00483321, usd: 1.02};
  const mockFetchTokenInfo = () => {
    return {ethereum: ETHPrices, dai: DAIPrices};
  };

  it('Should return empty prices when empty tokenDetails array', async () => {
    const tokenPricesService = new TokenPricesService();
    (tokenPricesService as any).fetchTokenInfo = () => {};
    const prices = await tokenPricesService.getPrices([]);
    expect(prices).be.deep.eq({});
  });

  it('Should return prices for ETH and DAI', async () => {
    const tokenDetails = [{symbol: 'ETH'}, {symbol: 'DAI'}] as TokenDetails[];
    const tokenPricesService = new TokenPricesService();
    (tokenPricesService as any).fetchTokenInfo = mockFetchTokenInfo;
    const prices = await tokenPricesService.getPrices(tokenDetails);
    const ethPrices = prices['ETH'];
    expect(ethPrices.ETH).be.eq(ETHPrices.eth);
    expect(ethPrices.USD).be.eq(ETHPrices.usd);
    const daiPrices = prices['DAI'];
    expect(daiPrices.ETH).be.eq(DAIPrices.eth);
    expect(daiPrices.USD).be.eq(DAIPrices.usd);
  });
});
