import {expect} from 'chai';
import {isStringANumber} from '../../../src';

describe('UNIT: isStringANumber', () => {
  it('value is \'\'', () => {
    expect(isStringANumber('')).to.be.eq(false);
  });

  it('value is \'123\'', () => {
    expect(isStringANumber('123')).to.be.eq(true);
  });

  it('value is \'12abc\'', () => {
    expect(isStringANumber('12abc')).to.be.eq(false);
  });

  it('value is \'123.2131\'', () => {
    expect(isStringANumber('123.2131')).to.be.eq(true);
  });

  it('value is \'-23.2\'', () => {
    expect(isStringANumber('-23.2')).to.be.eq(true);
  });

  it('value is \'0.0000\'', () => {
    expect(isStringANumber('0.000')).to.be.eq(true);
  });
});
