import {expect} from 'chai';
import {FeatureFlagsService} from '../../../lib/core/services/FeatureFlagsService';
import {Feature} from '../../../lib/core/models/Feature';

describe('FeatureFlagService', () => {
  let service: FeatureFlagsService;

  beforeEach(() => {
    service = new FeatureFlagsService();
  });

  it('empty', () => {
    expect(service.isEnabled(Feature.deleteAccount)).to.be.false;
    expect(service.isEnabled(Feature.requiredConfirmations)).to.be.false;
  });

  it('enableAll', () => {
    service.enableAll(['deleteAccount', 'requiredConfirmations']);
    expect(service.isEnabled('deleteAccount')).to.be.true;
    expect(service.isEnabled('requiredConfirmations')).to.be.true;
  });

  describe('isEnabled', () => {
    it('with enum', () => {
      service.enable(Feature.deleteAccount);
      expect(service.isEnabled(Feature.deleteAccount)).to.be.true;
    });

    it('with string (false)', () => {
      expect(service.isEnabled('deleteAccount')).to.be.false;
    });

    it('with string (true)', () => {
      service.enable(Feature.deleteAccount);
      expect(service.isEnabled('deleteAccount')).to.be.true;
    });

    it('with string (invalid feature)', () => {
      service.enable(Feature.deleteAccount);
      expect(() => service.isEnabled('nope')).to.throw('Invalid feature');
    });
  });

  it('isFeature', () => {
    expect(service.isFeature('deleteAccount')).to.be.true;
    expect(service.isFeature('nope')).to.be.false;
  });
});

