import {expect} from 'chai';
import {getPayButtonState} from '../../../src/app/TopUp/getPayButtonState';
import {TopUpProviderSupportService} from '../../../src/core/services/TopUpProviderSupportService';
import {countries} from '../../../src/core/utils/countries';
import {TopUpProvider} from '../../../src/core/models/TopUpProvider';

describe('getPayButtonState', () => {
  const topUpProviderSupportService = new TopUpProviderSupportService(countries);

  describe('hidden', () => {
    it('topUpMethod is undefined', () => {
      expect(getPayButtonState(undefined, topUpProviderSupportService, '0', undefined)).to.be.eq('hidden');
      expect(getPayButtonState(undefined, topUpProviderSupportService, '1', undefined)).to.be.eq('hidden');
      expect(getPayButtonState(TopUpProvider.SAFELLO, topUpProviderSupportService, '0', undefined)).to.be.eq('hidden');
      expect(getPayButtonState(TopUpProvider.RAMP, topUpProviderSupportService, '0', undefined)).to.be.eq('hidden');
    });

    it('topUpMethod is crypto', () => {
      expect(getPayButtonState(undefined, topUpProviderSupportService, '0', 'crypto')).to.be.eq('hidden');
      expect(getPayButtonState(undefined, topUpProviderSupportService, '1', 'crypto')).to.be.eq('hidden');
      expect(getPayButtonState(TopUpProvider.SAFELLO, topUpProviderSupportService, '0', 'crypto')).to.be.eq('hidden');
      expect(getPayButtonState(TopUpProvider.RAMP, topUpProviderSupportService, '0', 'crypto')).to.be.eq('hidden');
    });
  });

  describe('disabled', () => {
    it('topUpProvider is not selected', () => {
      expect(getPayButtonState(undefined, topUpProviderSupportService, '10', 'fiat')).to.be.eq('disabled');
      expect(getPayButtonState(undefined, topUpProviderSupportService, '-1', 'fiat')).to.be.eq('disabled');
      expect(getPayButtonState(undefined, topUpProviderSupportService, '', 'fiat')).to.be.eq('disabled');
    });

    it('ramp with amount <= 0 or invalid', () => {
      expect(getPayButtonState(TopUpProvider.RAMP, topUpProviderSupportService, '0', 'fiat')).to.be.eq('disabled');
      expect(getPayButtonState(TopUpProvider.RAMP, topUpProviderSupportService, '-1', 'fiat')).to.be.eq('disabled');
      expect(getPayButtonState(TopUpProvider.RAMP, topUpProviderSupportService, '', 'fiat')).to.be.eq('disabled');
    });
  });

  describe('active', () => {
    it('safello', () => {
      expect(getPayButtonState(TopUpProvider.SAFELLO, topUpProviderSupportService, '10', 'fiat')).to.be.eq('active');
      expect(getPayButtonState(TopUpProvider.SAFELLO, topUpProviderSupportService, '-1', 'fiat')).to.be.eq('active');
      expect(getPayButtonState(TopUpProvider.SAFELLO, topUpProviderSupportService, '', 'fiat')).to.be.eq('active');
    });

    it('ramp with amount > 0', () => {
      expect(getPayButtonState(TopUpProvider.RAMP, topUpProviderSupportService, '5', 'fiat')).to.be.eq('active');
    });
  });
});
