import {expect} from 'chai';
import {isValidAmount} from '../../../lib/core/utils/isValidAmount';

describe('isValidAmount', () => {
  it('return true for `1.0`', () => {
    expect(isValidAmount('1.0')).to.be.true;
  });

  it('return true for `10`', () => {
    expect(isValidAmount('10')).to.be.true;
  });

  it('return false for `ABC`', () => {
    expect(isValidAmount('ABC')).to.be.false;
  });

  it('return false for `1a00.1`', () => {
    expect(isValidAmount('1a00.1')).to.be.false;
  });

  it('return false for `14$.9`', () => {
    expect(isValidAmount('14$.9')).to.be.false;
  });

  it('return false for `100.`', () => {
    expect(isValidAmount('100.')).to.be.false;
  });
});
