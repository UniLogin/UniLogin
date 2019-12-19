import {expect} from 'chai';
import {FeatureFlagsService} from '../../../src/core/services/FeatureFlagsService';
import {Feature} from '../../../src/core/models/Feature';

describe('FeatureFlagService', () => {
  let service: FeatureFlagsService;

  beforeEach(() => {
    service = new FeatureFlagsService();
  });

  it('empty', () => {
    expect(service.isEnabled(Feature.disconnectAccount)).to.be.false;
    expect(service.isEnabled(Feature.requiredConfirmations)).to.be.false;
  });

  it('enableAll', () => {
    service.enableAll(['disconnectAccount', 'requiredConfirmations']);
    expect(service.isEnabled('disconnectAccount')).to.be.true;
    expect(service.isEnabled('requiredConfirmations')).to.be.true;
  });

  describe('isEnabled', () => {
    it('with enum', () => {
      service.enable(Feature.disconnectAccount);
      expect(service.isEnabled(Feature.disconnectAccount)).to.be.true;
    });

    it('with string (false)', () => {
      expect(service.isEnabled('disconnectAccount')).to.be.false;
    });

    it('with string (true)', () => {
      service.enable(Feature.disconnectAccount);
      expect(service.isEnabled('disconnectAccount')).to.be.true;
    });

    it('with string (invalid feature)', () => {
      service.enable(Feature.disconnectAccount);
      expect(() => service.isEnabled('nope')).to.throw('Invalid feature');
    });
  });

  it('isFeature', () => {
    expect(service.isFeature('disconnectAccount')).to.be.true;
    expect(service.isFeature('nope')).to.be.false;
  });
});
