import {expect} from 'chai';
import {SecurityCodeService} from '../../lib/services/SecurityCodeService'

describe('UNIT: SecurityCodeService', () => {
  const mockedAddress = '0xFFFFFFe7d45c34110B34Ed269AD86248884E78C7';
  const securityCodeService = new SecurityCodeService();

  describe('generateCode', () => {
    it('returns 6 numbers', () => {
      const encoding = securityCodeService.generateCode(mockedAddress);
      expect(encoding).to.deep.eq([ 619, 192, 20, 934, 264, 392 ]);
    });

    it('returns 6 numbers', () => {
      const encoding = securityCodeService.generateCode('0x0aFFFFe7d45c34110B34Ed269AD86248884E78C7');
      expect(encoding).to.deep.eq([350, 506, 372, 483, 576, 48]);
    });

    it('encoded numbers should by in [0, 1024)', () => {
      const encoding = securityCodeService.generateCode(mockedAddress);
      expect(encoding).to.satisfy((a: number[]) => a.every((e: number) => e < 1024));
      expect(encoding).to.satisfy((a: number[]) => a.every((e: number) => e >= 0));
    });
  });

  describe('isValidCode', () => {
    it('correct code entered', () => {
      const encodedAddress = securityCodeService.generateCode(mockedAddress);
      const isValid = securityCodeService.isValidCode(encodedAddress, mockedAddress);
      expect(isValid).to.be.true;
    });

    it('wrong code entered', () => {
      const codeKeyboard = securityCodeService.generateCodeWithFakes(mockedAddress);
      const wrongCodePickedByUser = codeKeyboard.splice(0, 6);
      const isValid = securityCodeService.isValidCode(wrongCodePickedByUser, mockedAddress);
      expect(isValid).to.be.false;
    });
  });

  describe('generateCodeWithFakes', () => {
    it('security code length should equal 12', () => {
      const securityCode = securityCodeService.generateCodeWithFakes(mockedAddress);
      expect(securityCode).to.satisfy((a: number[]) =>
        a.every((e) => [614, 619, 163, 392, 133, 934, 208, 264, 20, 366, 337, 192].includes(e))
      );
    });

    it('security code length should equal 12', () => {
      const securityCode = securityCodeService.generateCodeWithFakes('0x0aFFFFe7d45c34110B34Ed269AD86248884E78C7');
      expect(securityCode).to.satisfy((a: number[]) =>
        a.every((e) => [483, 48, 576, 372, 901, 454, 1016, 802, 350, 335, 311, 506].includes(e))
      );
    });
  });
});
