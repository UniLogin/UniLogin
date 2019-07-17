import {expect} from 'chai';
import {slices, shuffle, array8bitTo16bit} from '../../../lib/core/utils/arrays';

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

  describe('array8bitTo16bit', () => {
    it('[] -> []', () => {
      expect(array8bitTo16bit([])).to.deep.eq([]);
    });

    it('[1] -> [256]', () => {
      expect(array8bitTo16bit([1])).to.deep.eq([256]);
    });

    it('[1, 1] -> [257]', () => {
      expect(array8bitTo16bit([1, 1])).to.deep.eq([257]);
    });

    it('[1, 0] -> [256]', () => {
      expect(array8bitTo16bit([1, 0])).to.deep.eq([256]);
    });

    it('[1, 1, 1] -> [257, 256]', () => {
      expect(array8bitTo16bit([1, 1, 1])).to.deep.eq([257, 256]);
    });

    it('[0] -> [0]', () => {
      expect(array8bitTo16bit([0])).to.deep.eq([0]);
    });

    it('[1024] -> [0]', () => {
      expect(array8bitTo16bit([1024])).to.deep.eq([0]);
    });
  });
});
