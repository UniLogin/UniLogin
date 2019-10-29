import {expect} from 'chai';
import {TopUpProviderSupportService} from '../../../src/core/services/TopUpProviderSupportService';
import {countries} from '../../../src/core/utils/countries';
import {TopUpProvider} from '../../../src/core/models/TopUpProvider';
import {getPayButtonState} from '../../../src/app/TopUp/selectors';
import {TopUpMethod} from '../../../src/core/models/TopUpMethod';
import {ButtonState} from '../../../src/ui/TopUp/PayButton';

describe('getPayButtonState', () => {
  const topUpProviderSupportService = new TopUpProviderSupportService(countries);

  function test(provider: TopUpProvider | undefined, amount: string, method: TopUpMethod, result: ButtonState) {
    expect(getPayButtonState(
      {
        provider,
        amount,
        method,
      },
      topUpProviderSupportService,
    )).to.eq(result);
  }

  describe('hidden', () => {
    it('topUpMethod is undefined', () => {
      test(undefined, '0', undefined, 'hidden');
      test(undefined, '1', undefined, 'hidden');
      test(TopUpProvider.SAFELLO, '0', undefined, 'hidden');
      test(TopUpProvider.RAMP, '0', undefined, 'hidden');
    });

    it('topUpMethod is crypto', () => {
      test(undefined, '0', 'crypto', 'hidden');
      test(undefined, '1', 'crypto', 'hidden');
      test(TopUpProvider.SAFELLO, '0', 'crypto', 'hidden');
      test(TopUpProvider.RAMP, '0', 'crypto', 'hidden');
    });
  });

  describe('disabled', () => {
    it('topUpProvider is not selected', () => {
      test(undefined, '10', 'fiat', 'disabled');
      test(undefined, '-1', 'fiat', 'disabled');
      test(undefined, '', 'fiat', 'disabled');
    });

    it('ramp with amount <= 0 or invalid', () => {
      test(TopUpProvider.RAMP, '0', 'fiat', 'disabled');
      test(TopUpProvider.RAMP, '-1', 'fiat', 'disabled');
      test(TopUpProvider.RAMP, '', 'fiat', 'disabled');
    });
  });

  describe('active', () => {
    it('safello', () => {
      test(TopUpProvider.SAFELLO, '10', 'fiat', 'active');
      test(TopUpProvider.SAFELLO, '-1', 'fiat', 'active');
      test(TopUpProvider.SAFELLO, '', 'fiat', 'active');
    });

    it('ramp with amount > 0', () => {
      test(TopUpProvider.RAMP, '5', 'fiat', 'active');
    });
  });
});
