import {expect} from 'chai';
import {doubleNumber} from '../lib';

describe('doubleNumber', () => {
  it('doubles 5 to 10', () => {
    expect(doubleNumber(5)).to.eq(10);
  });

  it('doubles 7 to 14', () => {
    expect(doubleNumber(7)).to.eq(14);
  });
});
