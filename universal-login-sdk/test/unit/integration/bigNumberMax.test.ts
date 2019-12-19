import {utils} from 'ethers';
import {expect} from 'chai';
import {bigNumberMax} from '../../../src/core/utils/bigNumberMax';

describe('#bigNumberMax', () => {
  const value = utils.parseEther('10');
  const validationValueBigger = utils.parseEther('20');
  const validationValueSmaller = utils.parseEther('5');

  it('return value', () => {
    expect(bigNumberMax(value, validationValueSmaller)).to.eq(value);
  });

  it('return validationValue', () => {
    expect(bigNumberMax(value, validationValueBigger)).to.eq(validationValueBigger);
  });
});
