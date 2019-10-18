import {expect} from 'chai';
import {isInputAmountUsed} from '../../../src/core/utils/isInputAmountUsed';
import {TopUpProvider} from '../../../src/core/models/TopUpProvider';

describe('isInputAmountUsed', () => {
  it('Safello', () => {
    expect(isInputAmountUsed(TopUpProvider.SAFELLO)).to.be.false;
  });

  it('Ramp', () => {
    expect(isInputAmountUsed(TopUpProvider.RAMP)).to.be.true;
  });

  it('undefined', () => {
    expect(isInputAmountUsed()).to.be.false;
  });
});
