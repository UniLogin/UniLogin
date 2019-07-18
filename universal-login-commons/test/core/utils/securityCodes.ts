import {expect} from 'chai';
import {generateCode, generateCodeWithFakes, isValidCode, addCodesToNotifications} from '../../../lib/core/utils/securityCodes';

describe('UNIT: security codes', () => {
  const mockedAddress = '0xFFFFFFe7d45c34110B34Ed269AD86248884E78C7';

  const toBeProperCodeNumber = (code: number) => {
    return 0 <= code && code < 1024;
  };

  const toBeProperSecurityCode = (securityCode: number[]) => {
    return securityCode.length === 6 &&
            securityCode.every((e: number) => toBeProperCodeNumber(e));
  };

  const toBeProperSecurityCodeWithFakes = (securityCode: number[]) => {
    return securityCode.length === 12 &&
            securityCode.every((e: number) => toBeProperCodeNumber(e));
  };

  describe('generateCode', () => {
    it('returns 6 numbers', () => {
      const encoding = generateCode(mockedAddress);
      expect(encoding).to.deep.eq([ 619, 192, 20, 934, 264, 392 ]);
    });

    it('returns 6 numbers', () => {
      const encoding = generateCode('0x0aFFFFe7d45c34110B34Ed269AD86248884E78C7');
      expect(encoding).to.deep.eq([350, 506, 372, 483, 576, 48]);
    });

    it('encoded numbers should by in [0, 1024)', () => {
      const securityCode = generateCode(mockedAddress);
      const isProperSecurityCode = toBeProperSecurityCode(securityCode);
      expect(isProperSecurityCode).to.be.true;
    });
  });

  describe('isValidCode', () => {
    it('correct code entered', () => {
      const encodedAddress = generateCode(mockedAddress);
      const isValid = isValidCode(encodedAddress, mockedAddress);
      expect(isValid).to.be.true;
    });

    it('wrong code entered', () => {
      const codeKeyboard = generateCodeWithFakes(mockedAddress);
      const wrongCodePickedByUser = codeKeyboard.splice(0, 6);
      const isValid = isValidCode(wrongCodePickedByUser, mockedAddress);
      expect(isValid).to.be.false;
    });
  });

  describe('generateCodeWithFakes', () => {
    it('security code length should equal 12', () => {
      const securityCode = generateCodeWithFakes('0x0aFFFFe7d45c34110B34Ed269AD86248884E78C7');
      const isProperSecurityCode = toBeProperSecurityCodeWithFakes(securityCode);
      expect(isProperSecurityCode).to.be.true;
    });
  });

  describe('addCodesToNotifications', () => {
    it('[]', () => {
      expect(addCodesToNotifications([])).to.deep.eq([]);
    });

    it('augment notifications with security code', () => {
      const notifications = [
        {
          id: 524,
          walletContractAddress: '0xd9822cf2a4c3accd2af175a5df0376d46dcb848d',
          key: '0x6f475fa97d9d0ab1149068c1c81bd7e3a8be2139',
          deviceInfo: {
            ipAddress: '::ffff:127.0.0.1',
            name: 'unknown',
            city: 'unknown',
            os: 'unknown',
            browser: 'node-fetch',
            time: '1:30'
          }
        }
      ];
      const [resultNotification] = addCodesToNotifications(notifications);
      expect(resultNotification).to.have.property('securityCodeWithFakes');

      const isProperSecurityCode = toBeProperSecurityCodeWithFakes(resultNotification.securityCodeWithFakes!);
      expect(isProperSecurityCode).to.be.true;
    });
  });
});
