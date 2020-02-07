import {expect} from 'chai';
import {getModalProgressWidth} from '../../../src/core/utils/getModalProgressWidth';
import {MAX_PROGRESS_BAR_WIDTH} from '../../../src/core/constants/maxProgressBarWidth';

describe('UNIT: getModalProgressWidth', () => {
  it('NaN', () => {
    expect(getModalProgressWidth(0, 0)).to.NaN;
  });

  it('MAX_PROGRESS_BAR_WIDTH', () => {
    expect(getModalProgressWidth(1, 1)).to.eq(MAX_PROGRESS_BAR_WIDTH);
  });

  it('1/5 of MAX_PROGRESS_BAR_WIDTH', () => {
    expect(getModalProgressWidth(1, 5)).to.eq(MAX_PROGRESS_BAR_WIDTH / 5);
  });
});
