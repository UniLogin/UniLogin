import chai, {expect} from 'chai';
import {normalizeBigNumber, bigNumberifyDecimal} from '../../../src/core/utils/bigNumbers';
import {BigNumber} from 'ethers/utils';
import {solidity} from 'ethereum-waffle';
import {utils} from 'ethers';

chai.use(solidity);

describe('UNIT: BigNumber', () => {
  describe('normalizeBigNumber', () => {
    it('0x00', () => {
      const a = new BigNumber('0x00');
      const b = new BigNumber('0x0');

      const expected = normalizeBigNumber(b);

      expect(expected).to.eql(a);
    });

    it('0x1', () => {
      const a = new BigNumber('0x01');
      const b = new BigNumber('0x1');

      const expected = normalizeBigNumber(b);

      expect(expected).to.eql(a);
    });

    it('0x199', () => {
      const a = new BigNumber('0x0199');
      const b = new BigNumber('0x199');

      const expected = normalizeBigNumber(b);

      expect(expected).to.eql(a);
    });

    it('0x0000000', () => {
      const a = new BigNumber('0x00');
      const b = new BigNumber('0x0000000');

      const expected = normalizeBigNumber(b);

      expect(expected).to.eql(a);
    });
  });

  describe('bigNumberifyDecimal', () => {
    it('199.99', () => {
      expect(bigNumberifyDecimal('199.99')).to.eq(utils.bigNumberify('199'));
    });

    it('0.6', () => {
      expect(bigNumberifyDecimal('0.6')).to.eq(utils.bigNumberify('0'));
    });

    it('1', () => {
      expect(bigNumberifyDecimal('1')).to.eq(utils.bigNumberify('1'));
    });

    it('3.2', () => {
      expect(bigNumberifyDecimal('3.2')).to.eq(utils.bigNumberify('3'));
    });
  });
});
