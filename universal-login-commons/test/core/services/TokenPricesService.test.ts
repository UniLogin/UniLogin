import {expect} from 'chai';
import {TokenPricesService, TokenDetails, ETHER_NATIVE_TOKEN, TEST_DAI_TOKEN} from '../../../src';
import {Coingecko} from '../../../src/integration/http/Coingecko';

describe('UNIT: TokenPricesService', () => {
  const coingecko = new Coingecko();
  const tokenPricesService = new TokenPricesService(coingecko);

  const ETHPrices = {eth: 1, usd: 213.69};
  const DAIPrices = {eth: 0.00483321, usd: 1.02};

  beforeEach(() => {
    coingecko.fetchTokenInfo = () => Promise.resolve({ethereum: ETHPrices, dai: DAIPrices});
  });

  it('return empty prices when empty tokenDetails array', async () => {
    coingecko.fetchTokenInfo = () => Promise.resolve({});
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

  describe('updateAaveTokenDetails', () => {
    it('aave token', () => {
      const aUsdcAddress = '0x9bA00D6856a4eDF4665BcA2C2309936572473B7E';
      const aaveToken = {
        symbol: 'aUSDC',
        name: 'Aave Interest bearing USDC',
        address: aUsdcAddress,
      } as TokenDetails;
      const modifiedToken = tokenPricesService.updateAaveTokenDetails(aaveToken);
      expect(modifiedToken).deep.eq({
        symbol: 'USDC',
        name: 'USDC',
        address: aUsdcAddress,
      });
    });

    it('not aave token', () => {
      const modifiedToken = tokenPricesService.updateAaveTokenDetails(TEST_DAI_TOKEN);
      expect(modifiedToken).deep.eq(TEST_DAI_TOKEN);
    });
  });
});
