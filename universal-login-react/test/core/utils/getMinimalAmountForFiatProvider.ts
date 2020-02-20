import {expect} from 'chai';
import sinon from 'sinon';
import {getMinimalAmountForFiatProvider} from '../../../src/core/utils/getMinimalAmountForFiatProvider';
import {TopUpProvider} from '../../../src/core/models/TopUpProvider';
import * as sdk from '@unilogin/sdk';

describe('getMinimalAmountForFiatProvider', () => {
  describe('RAMP provider', () => {
    const paymentMethod = TopUpProvider.RAMP;

    before(() => {
      sinon.stub(sdk, 'getEtherPriceInCurrency').returns(new Promise((resolve) => resolve('1')));
    });

    it('return provider minimal amount', async () => {
      const bigMinimalAmount = '2';
      expect(await getMinimalAmountForFiatProvider(paymentMethod, bigMinimalAmount)).to.eq('2.0');
    });

    it('return UniversalLogin minimal amount', async () => {
      const smallMinimalAmount = '0.0001';
      expect(await getMinimalAmountForFiatProvider(paymentMethod, smallMinimalAmount)).to.eq('1.0');
    });
  });
});
