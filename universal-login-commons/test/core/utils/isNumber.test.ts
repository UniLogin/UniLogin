import {expect} from 'chai';
import {isNumber} from '../../../src';

describe('UNIT: isNumber', () => {
  it('value is \'\'', () => {
    expect(isNumber('')).to.be.eq(false);
  });

  it('value is \'123\'', () => {
    expect(isNumber('123')).to.be.eq(true);
  });

  it('value is \'12abc\'', () => {
    expect(isNumber('12abc')).to.be.eq(false);
  });

  it('value is \'123.2131\'', () => {
    expect(isNumber('123.2131')).to.be.eq(true);
  });

  it('value is \'-23.2\'', () => {
    expect(isNumber('-23.2')).to.be.eq(true);
  });

  it('value is \'0.0000\'', () => {
    expect(isNumber('0.000')).to.be.eq(true);
  });
});
