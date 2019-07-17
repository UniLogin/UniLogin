import {expect} from 'chai';
import {slices, shuffle} from '../../../lib/core/utils/arrays';

describe('UNIT: Arrays', () => {
  describe('slices', () => {
    it('slice size 1', () => {
      expect(Array.from(slices([1, 2, 3], 1))).to.deep.eq([[1], [2], [3]]);
    });

    it('slice of size 2', () => {
      expect(Array.from(slices([1, 2, 3], 2))).to.deep.eq([[1, 2], [3]]);
    });
  });

  describe('shuffle', () => {
    it('single element', () => {
      expect(shuffle([1])).to.deep.eq([1]);
    });

    it('many elements', () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8];
      const output = shuffle(input);
      expect(input).not.to.eq(output);
      expect(input.sort()).to.deep.eq(output.sort());
    });
  });
});
