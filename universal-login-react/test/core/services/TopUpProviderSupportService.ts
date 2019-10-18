import {expect} from 'chai';
import {TopUpProviderSupportService} from '../../../src/core/services/TopUpProviderSupportService';
import {countries} from '../../../src/core/utils/countries';
import {TopUpProvider} from '../../../src/core/models/TopUpProvider';

describe('TopUpProviderSupportService', function () {
  let service: TopUpProviderSupportService;

  beforeEach(function () {
    service = new TopUpProviderSupportService(countries);
  });

  describe('checkRampSupport', function () {
    it('returns true for supported country', function () {
      expect(service.checkRampSupport('United Kingdom')).to.be.true;
    });

    it('returns false for unsupported country', function () {
      expect(service.checkRampSupport('Poland')).to.be.false;
    });
  });

  describe('checkSafelloSupport', function () {
    it('returns true for supported country', function () {
      expect(service.checkSafelloSupport('Poland')).to.be.true;
    });

    it('returns false for unsupported country', function () {
      expect(service.checkSafelloSupport('United States')).to.be.false;
    });
  });

  describe('checkWyreSupport', function () {
    it('returns true for supported country', function () {
      expect(service.checkWyreSupport('United States')).to.be.true;
    });

    it('returns false for unsupported country', function () {
      expect(service.checkWyreSupport('Poland')).to.be.false;
    });
  });

  describe('getSupportingProviders', function () {
    it('returns a list of providers supporting given country', function () {
      expect(service.getProviders('United Kingdom'))
        .to.have.members([TopUpProvider.RAMP, TopUpProvider.SAFELLO]);
    });

    it('returns an empty list for unsupported country', function () {
      expect(service.getProviders('Albania')).to.be.an('array').that.is.empty;
    });
  });
});
