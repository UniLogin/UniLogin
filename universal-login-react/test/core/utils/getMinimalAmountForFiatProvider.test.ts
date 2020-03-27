import {expect} from 'chai';
import sinon from 'sinon';
import {getMinimalAmountForFiatProvider} from '../../../src/core/utils/getMinimalAmountForFiatProvider';
import {TopUpProvider} from '../../../src/core/models/TopUpProvider';
import * as sdk from '@unilogin/sdk';

describe('UNIT: getMinimalAmountForFiatProvider', () => {
  before(() => {
    sinon.stub(sdk, 'getEtherPriceInCurrency').returns(new Promise((resolve) => resolve('1')));
  });

  describe('RAMP provider', () => {
    const paymentMethod = TopUpProvider.RAMP;

    it('return provider minimal amount', async () => {
      const bigMinimalAmount = '2';
      expect(await getMinimalAmountForFiatProvider(paymentMethod, bigMinimalAmount)).to.eq('2.0');
    });

    it('return UniversalLogin minimal amount', async () => {
      const smallMinimalAmount = '0.0001';
      expect(await getMinimalAmountForFiatProvider(paymentMethod, smallMinimalAmount)).to.eq('1.0');
    });
  });

  describe('SAFELLO provider', () => {
    const paymentMethod = TopUpProvider.SAFELLO;

    it('return Safello minimal amount', async () => {
      const smallMinimalAmount = '1';
      expect(await getMinimalAmountForFiatProvider(paymentMethod, smallMinimalAmount)).to.eq('30');
    });

    it('return value higher then minimal amount', async () => {
      const bigMinimalAmount = '100';
      expect(await getMinimalAmountForFiatProvider(paymentMethod, bigMinimalAmount)).to.eq('100');
    });

    it('return value higher then minimal amount with ceiling', async () => {
      const bigMinimalAmount = '100.011';
      expect(await getMinimalAmountForFiatProvider(paymentMethod, bigMinimalAmount)).to.eq('100.02');
    });
  });
});
