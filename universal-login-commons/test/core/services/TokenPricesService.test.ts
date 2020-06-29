import {expect} from 'chai';
import {TokenPricesService, TokenDetails, ETHER_NATIVE_TOKEN} from '../../../src';
import {CoingeckoApi} from '../../../src/integration/http/CoingeckoApi';

describe('UNIT: TokenPricesService', () => {
  const coingeckoApi = new CoingeckoApi();
  const tokenPricesService = new TokenPricesService(coingeckoApi);

  const ETHPrices = {eth: 1, usd: 213.69};
  const DAIPrices = {eth: 0.00483321, usd: 1.02};

  beforeEach(() => {
    coingeckoApi.fetchTokenInfo = () => Promise.resolve({ethereum: ETHPrices, dai: DAIPrices});
  });

  it('return empty prices when empty tokenDetails array', async () => {
    coingeckoApi.fetchTokenInfo = () => Promise.resolve({});
    const prices = await tokenPricesService.getPrices([]);
    expect(prices).be.deep.eq({});
  });

  it('return prices for ETH and DAI', async () => {
    const tokensDetails = [{symbol: 'ETH', name: 'ethereum'}, {symbol: 'DAI', name: 'Dai stable coin'}] as TokenDetails[];
    const prices = await tokenPricesService.getPrices(tokensDetails);
    const ethPrices = prices['ETH'];
    expect(ethPrices.ETH).be.eq(ETHPrices.eth);
    expect(ethPrices.USD).be.eq(ETHPrices.usd);
    const daiPrices = prices['DAI'];
    expect(daiPrices.ETH).be.eq(DAIPrices.eth);
    expect(daiPrices.USD).be.eq(DAIPrices.usd);
  });

  describe('return token price in eth', () => {
    it('dai', async () => {
      const tokenDetails = {symbol: 'DAI', name: 'Dai stable coin'} as TokenDetails;
      const priceInEth = await tokenPricesService.getTokenPriceInEth(tokenDetails);
      expect(priceInEth).eq(DAIPrices.eth);
    });

    it('eth', async () => {
      const priceInEth = await tokenPricesService.getTokenPriceInEth(ETHER_NATIVE_TOKEN);
      expect(priceInEth).eq(ETHPrices.eth);
    });
  });
});
