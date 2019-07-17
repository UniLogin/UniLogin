import {expect} from 'chai';
import {slices} from '../../../lib/core/utils/slices';

describe('UNIT: slices', () => {
  it('slice size 1', () => {
    expect(Array.from(slices([1, 2, 3], 1))).to.deep.eq([[1], [2], [3]]);
  });

  it('slice of size 2', () => {
    expect(Array.from(slices([1, 2, 3], 2))).to.deep.eq([[1, 2], [3]]);
  });
});
