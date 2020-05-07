import {expect} from 'chai';
import {TokenPricesService, TokenDetails} from '../../../src';

describe('UNIT: TokenPricesService', () => {
  const tokenPricesService = new TokenPricesService();

  const ETHPrices = {eth: 1, usd: 213.69};
  const DAIPrices = {eth: 0.00483321, usd: 1.02};

  beforeEach(() => {
    (tokenPricesService as any).fetchTokenInfo = () => Promise.resolve({ethereum: ETHPrices, dai: DAIPrices});
  });

  it('return empty prices when empty tokenDetails array', async () => {
    (tokenPricesService as any).fetchTokenInfo = () => {};
    const prices = await tokenPricesService.getPrices([]);
    expect(prices).be.deep.eq({});
  });

  it('return prices for ETH and DAI', async () => {
    const tokensDetails = [{symbol: 'ETH'}, {symbol: 'DAI'}] as TokenDetails[];
    const prices = await tokenPricesService.getPrices(tokensDetails);
    const ethPrices = prices['ETH'];
    expect(ethPrices.ETH).be.eq(ETHPrices.eth);
    expect(ethPrices.USD).be.eq(ETHPrices.usd);
    const daiPrices = prices['DAI'];
    expect(daiPrices.ETH).be.eq(DAIPrices.eth);
    expect(daiPrices.USD).be.eq(DAIPrices.usd);
  });

  it('return token price in eth', async () => {
    const tokenDetails = {symbol: 'DAI'} as TokenDetails;
    const priceInEth = await tokenPricesService.getTokenPriceInEth(tokenDetails);
    expect(priceInEth).eq(0.00483321);
  });
});
