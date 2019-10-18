import {expect} from 'chai';
import {isPrefilledAmountUsedBy} from '../../../src/core/utils/isPrefilledAmountUsedBy';
import {TopUpProvider} from '../../../src/core/models/TopUpProvider';

describe('isPrefilledAmountUsedBy', () => {
  it('Safello', () => {
    expect(isPrefilledAmountUsedBy(TopUpProvider.SAFELLO)).to.be.false;
  });

  it('Ramp', () => {
    expect(isPrefilledAmountUsedBy(TopUpProvider.RAMP)).to.be.true;
  });

  it('undefined', () => {
    expect(isPrefilledAmountUsedBy()).to.be.false;
  });
});
