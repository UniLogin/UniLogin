import {expect} from 'chai';
import {slices, shuffle, array8bitTo16bit, deepArrayStartWith, getArrayElementsFromIndicies} from '../../../lib/core/utils/arrays';
import {utils} from 'ethers';

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

  describe('deepArrayStartWith', () => {
    it('[], []', () => {
      expect(deepArrayStartWith([], [])).to.be.true;
    });

    it('[1, 2, 3], [1, 2, 3, 4, 5]', () => {
      expect(deepArrayStartWith([1, 2, 3], [1, 2, 3, 4, 5])).to.be.true;
    });

    it('[1, 1, 1], [1, 1]', () => {
      expect(deepArrayStartWith([1, 1, 1], [1, 1])).to.be.false;
    });

    it('[1], [2]', () => {
      expect(deepArrayStartWith([1], [2])).to.be.false;
    });

    it('[bigNumber(1), {leet: 1337}, `deadbeef`], [bigNumber(1), {leet: 1337}, `deadbeef`, [1]]', () => {
      const prefix = [utils.bigNumberify('42'), {leet: 1337}, 'deadbeef'];
      const array = [utils.bigNumberify('42'), {leet: 1337}, 'deadbeef', [1]];
      expect(deepArrayStartWith(prefix, array)).to.be.true;
    });
  });

  describe('getArrayElementsFromIndicies', () => {
    it('A, []', () => {
      const array = [1, 2, 3];
      expect(getArrayElementsFromIndicies(array, [])).to.deep.equal([]);
    });

    it('A, [0, 1]', () => {
      const array = [1, 2, 3];
      expect(getArrayElementsFromIndicies(array, [0, 1])).to.deep.equal([1, 2]);
    });

    it('A, [-1, -2]', () => {
      const array = [1, 2, 3];
      expect(getArrayElementsFromIndicies(array, [-1, -2])).to.deep.equal([]);
    });

    it('A, [-1, 0, 1]', () => {
      const array = [1, 2, 3];
      expect(getArrayElementsFromIndicies(array, [-1, 0, 1])).to.deep.equal([1, 2]);
    });

    it('A, [0, 100, 1]', () => {
      const array = [1, 2, 3];
      expect(getArrayElementsFromIndicies(array, [0, 100, 1])).to.deep.equal([1, 2]);
    });
  });
});
