import {expect} from 'chai';
import {isProperAddress, reverseHexString} from '../../../lib/core/utils/hexStrings';
import {TEST_ACCOUNT_ADDRESS} from '../../../lib';


describe('UNIT: hex strings', () => {
  describe('isProperAddress', () => {
    it('proper address', () => {
      expect(isProperAddress('0xFFFFFFe7d45c34110B34Ed269AD86248884E78C7')).to.be.true;
    });

    it('too short', () => {
      expect(isProperAddress('0xFFF')).to.be.false;
    });

    it('no prefix', () => {
      expect(isProperAddress('FFFFFFe7d45c34110B34Ed269AD86248884E78C7')).to.be.false;
    });

    it('invalid charater', () => {
      expect(isProperAddress('0xXFFFFe7d45c34110B34Ed269AD86248884E78C7')).to.be.false;
    });

    it('too long', () => {
      expect(isProperAddress('0xFFFFFe7d45c34110B34Ed269AD86248884E78C74534545')).to.be.false;
    });
  });

  describe('reverse hex string', () => {
    const hexString = '0xFFFFFFe7d45c34110B34Ed269AD86248884E78C7';

    it('empty hex 0x', () => {
      expect(reverseHexString('0x')).to.eq('0x');
    });

    it('0xab == rev(0xba)', () => {
      expect(reverseHexString('0xab')).to.eq('0xba');
    });

    it('rev(rev(hex)) == hex', () => {
      expect(reverseHexString(reverseHexString(hexString))).to.eq(hexString);
    });

    it('check constant address', () => {
      expect(reverseHexString(TEST_ACCOUNT_ADDRESS)).to.eq('0x1000000000000000000000000000000000000000');
    });
  });
});
