import {expect} from 'chai';
import {getEnumKeys} from '../../../src';

describe('getEnumKeys', () => {
  it('empty enum', () => {
    enum E {}
    expect(getEnumKeys(E)).to.deep.eq([]);
  });

  it('number enum', () => {
    enum E {a, b}
    expect(getEnumKeys(E)).to.deep.eq(['a', 'b']);
  });
});
