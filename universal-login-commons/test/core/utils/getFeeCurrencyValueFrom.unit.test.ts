import {expect} from 'chai';
import {ETHER_NATIVE_TOKEN, TEST_PRIVATE_KEY} from '../../../src';
import {getTestSignedMessage} from '../../helpers/getTestMessage';
import {getFeeCurrencyValueFrom} from '../../../src/core/utils/getFeeCurrencyValueFrom';
import {CurrencyValue} from '../../../src/core/models/CurrencyValue';

describe('UNIT: getFeeCurrencyValueFrom', () => {
  describe('ETH', () => {
    it('return value eq 0 when gasPrice is 0', () => {
      const signedMessage = getTestSignedMessage(TEST_PRIVATE_KEY, {gasPrice: 0, safeTxGas: 100, baseGas: 1000, gasToken: ETHER_NATIVE_TOKEN.address});
      expect(getFeeCurrencyValueFrom(signedMessage)).to.be.deep.eq(CurrencyValue.fromWei(0, ETHER_NATIVE_TOKEN.address));
    });

    it('return value eq 0 when gas limit is 0', () => {
      const signedMessage = getTestSignedMessage(TEST_PRIVATE_KEY, {gasPrice: 100000, safeTxGas: 0, baseGas: 0, gasToken: ETHER_NATIVE_TOKEN.address});
      expect(getFeeCurrencyValueFrom(signedMessage)).to.be.deep.eq(CurrencyValue.fromWei(0, ETHER_NATIVE_TOKEN.address));
    });

    it('return value eq 5500', () => {
      const signedMessage = getTestSignedMessage(TEST_PRIVATE_KEY, {gasPrice: 5, safeTxGas: 100, baseGas: 1000, gasToken: ETHER_NATIVE_TOKEN.address});
      expect(getFeeCurrencyValueFrom(signedMessage)).to.be.deep.eq(CurrencyValue.fromWei(5500, ETHER_NATIVE_TOKEN.address));
    });
  });
});
