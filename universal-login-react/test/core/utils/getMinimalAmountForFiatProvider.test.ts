import {expect} from 'chai';
import sinon from 'sinon';
import {getMinimalAmountForFiatProvider, getMinimalAmount} from '../../../src/core/utils/getMinimalAmountForFiatProvider';
import {TopUpProvider} from '../../../src/core/models/TopUpProvider';
import {TokenPricesService, TEST_TOKEN_PRICE_IN_ETH, TEST_DAI_TOKEN} from '@unilogin/commons';

describe('getMinimalAmountForFiatProvider', () => {
  describe('RAMP provider', () => {
    const paymentMethod = TopUpProvider.RAMP;
    const tokenPricesService = new TokenPricesService();

    before(() => {
      sinon.stub(tokenPricesService, 'getEtherPriceInCurrency').resolves('150');
    });

    it('return provider minimal amount', async () => {
      const bigMinimalAmount = '2';
      const {generalMinimalAmount, minimalAmountForRevolut} = await getMinimalAmountForFiatProvider(paymentMethod, bigMinimalAmount, tokenPricesService);
      expect(generalMinimalAmount).to.eq('2');
      expect(minimalAmountForRevolut).to.eq('2');
    });

    it('return UniLogin minimal amount', async () => {
      const smallMinimalAmount = '0.0001';
      const {generalMinimalAmount, minimalAmountForRevolut} = await getMinimalAmountForFiatProvider(paymentMethod, smallMinimalAmount, tokenPricesService);
      expect(generalMinimalAmount).to.eq('0.004');
      expect(minimalAmountForRevolut).to.eq('0.0134');
    });

    it('return correct UniLogin minimal amount for DAI', async () => {
      const smallMinimalAmount = '0.0000002';
      (tokenPricesService.getTokenPriceInEth as any) = () => TEST_TOKEN_PRICE_IN_ETH;
      const {generalMinimalAmount, minimalAmountForRevolut} = await getMinimalAmountForFiatProvider(paymentMethod, smallMinimalAmount, tokenPricesService, TEST_DAI_TOKEN);
      expect(generalMinimalAmount).to.eq('0.8');
      expect(minimalAmountForRevolut).to.eq('2.6667');
    });

    it('return correct minimal amount for DAI', async () => {
      const bigMinimalAmount = '1500.5';
      (tokenPricesService.getTokenPriceInEth as any) = () => TEST_TOKEN_PRICE_IN_ETH;
      const {generalMinimalAmount, minimalAmountForRevolut} = await getMinimalAmountForFiatProvider(paymentMethod, bigMinimalAmount, tokenPricesService, TEST_DAI_TOKEN);
      expect(generalMinimalAmount).to.eq(bigMinimalAmount);
      expect(minimalAmountForRevolut).to.eq(bigMinimalAmount);
    });

    it('return rounded provider minimal amount for Wyre', async () => {
      const bigMinimalAmount = '2.000000156565';
      const paymentMethod = TopUpProvider.WYRE;
      expect((await getMinimalAmountForFiatProvider(paymentMethod, bigMinimalAmount, tokenPricesService)).generalMinimalAmount).to.eq('2.0001');
    });

    after(() => {
      sinon.restore();
    });
  });
});

describe('UNIT: getMinimalAmount', () => {
  const tokenPricesService = new TokenPricesService();

  before(() => {
    sinon.stub(tokenPricesService, 'getEtherPriceInCurrency').resolves('1');
  });

  it('returns 2 for Ramp and Revolut and future wallet', async () => {
    const walletService = {
      getRequiredDeploymentBalance: () => '2',
      isKind: (state: string) => state === 'Future',
    };
    const paymentMethod = TopUpProvider.RAMP;
    const {generalMinimalAmount, minimalAmountForRevolut} = await getMinimalAmount(walletService as any, paymentMethod, tokenPricesService);
    expect(generalMinimalAmount).to.eq('2');
    expect(minimalAmountForRevolut).to.eq('2');
  });

  it('returns 30 for Safello and future wallet', async () => {
    const walletService = {
      getRequiredDeploymentBalance: () => '2',
      isKind: (state: string) => state === 'Future',
    };
    const paymentMethod = TopUpProvider.SAFELLO;
    expect((await getMinimalAmount(walletService as any, paymentMethod, tokenPricesService)).generalMinimalAmount).to.eq('30');
  });

  it('returns 30 for Safello and deployed wallet', async () => {
    const walletService = {
      isKind: (state: string) => state === 'Deployed',
      isDeployed: () => true,
    };
    const paymentMethod = TopUpProvider.SAFELLO;
    expect((await getMinimalAmount(walletService as any, paymentMethod, tokenPricesService)).generalMinimalAmount).to.eq('30');
  });

  it('returns general 0.6 and Revolut 2 for Ramp and deployed wallet', async () => {
    const walletService = {
      isKind: (state: string) => state === 'Deployed',
      isDeployed: () => true,
    };
    const paymentMethod = TopUpProvider.RAMP;
    const {generalMinimalAmount, minimalAmountForRevolut} = await getMinimalAmount(walletService as any, paymentMethod, tokenPricesService);
    expect(generalMinimalAmount).to.eq('0.6');
    expect(minimalAmountForRevolut).to.eq('2');
  });

  it('Throw error if invalid wallet state', async () => {
    const walletService = {
      state: {kind: 'None'},
      isKind: (state: string) => state === 'None',
      isDeployed: () => false,
    };
    const paymentMethod = TopUpProvider.RAMP;
    expect(() => getMinimalAmount(walletService as any, paymentMethod, tokenPricesService)).to.throw('Wallet state is None, but expected Future or Deployed');
  });

  after(() => {
    sinon.restore();
  });
});
