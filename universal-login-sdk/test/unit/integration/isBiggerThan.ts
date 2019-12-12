import {utils} from 'ethers';
import {expect} from 'chai';
import {isBiggerThan} from '../../../lib/core/utils/isBiggerThan';

describe('#isBiggerThan', () => {
  const value = utils.parseEther('10');
  const validationValueBigger = utils.parseEther('20');
  const validationValueSmaller = utils.parseEther('5');

  it('return value', () => {
    expect(isBiggerThan(value, validationValueSmaller)).to.eq(value);
  });

  it('return validationValue', () => {
    expect(isBiggerThan(value, validationValueBigger)).to.eq(validationValueBigger);
  });
});
