import {expect} from 'chai';
import {SecurityCodeService} from '../../lib/services/SecurityCodeService';

describe('UNIT: SecurityCodeService', () => {
  const mockedAddress = '0xFFFFFFe7d45c34110B34Ed269AD86248884E78C7';
  const securityCodeService = new SecurityCodeService();

  describe('8bit numbers -> 10bit number conversion', () => {
    const high = 3;
    const low = 255;
    const longNumber =  1023;
    it('8bit numbers -> 10bit conversion', () => {
      expect(securityCodeService.to10bitNumber(high, low)).to.eq(longNumber);
    });

    it('trunked 8bit -> 10bit conversion', () => {
      expect(securityCodeService.to10bitNumber(1024 + high, 2048 + low)).to.eq(longNumber);
    });
  });

  it('return should be 6 (10bit) numbers', () => {
    const encoding = securityCodeService.encode(mockedAddress);
    expect(encoding.length).to.eq(securityCodeService.securityCodeLength);
    expect(typeof encoding[0]).to.eq('number');
    expect(encoding[0] & 0xFC00).to.eq(0);
    expect(encoding[0]).to.eq(1023);
  });

  it('extend should return code with specific length', () => {
    const securityCode = securityCodeService.getSecurityCode(mockedAddress);
    expect(securityCode.length).to.eq(securityCodeService.securityKeyboardSize);
  });

  it('address before encoding should match addres after decoding', () => {
    const encodedAddress = securityCodeService.encode(mockedAddress);
    const isValid = securityCodeService.isCodeValid(encodedAddress, mockedAddress);
    expect(isValid).to.be.true;
  });

  it('wrong code entered', () => {
    const codeKeyboard = securityCodeService.getSecurityCode(mockedAddress);
    const wrongCodePickedByUser = codeKeyboard.splice(0, 6);
    const isValid = securityCodeService.isCodeValid(wrongCodePickedByUser, mockedAddress);
    expect(isValid).to.be.false;
  });
});
