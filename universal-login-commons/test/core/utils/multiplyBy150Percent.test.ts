import {expect} from 'chai';
import {multiplyBy150Percent} from '../../../src/core/utils/multiplyBy150Percent';

describe('UNIT: multiplyBy150Percent', () => {
  it('returns 0 for 0', () => {
    expect(multiplyBy150Percent('0')).to.eq('0');
  });

  it('returns 1 for 1', () => {
    expect(multiplyBy150Percent('1')).to.eq('1');
  });

  it('returns 150 for 100', () => {
    expect(multiplyBy150Percent('100')).to.eq('150');
  });

  it('returns 1500 for 1000', () => {
    expect(multiplyBy150Percent('1000')).to.eq('1500');
  });
});
