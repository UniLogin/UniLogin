import {expect} from 'chai';
import {filterKeyWithCodeByPrefix, filterNotificationByCodePrefix, generateCode, generateCodeWithFakes, isValidCode, addCodesToNotifications, isProperSecurityCode, isProperSecurityCodeWithFakes} from '../../../lib/core/utils/securityCodes';
import {Notification} from '../../../lib';

describe('UNIT: security codes', () => {
  const mockedAddress = '0xFFFFFFe7d45c34110B34Ed269AD86248884E78C7';

  describe('filterNotificationByCodePrefix', () => {
    const notifications = [
      {key: '0x121323c0564ac2b0d5ae5d71773e8f208e301270'},
      {key: '0x121323c0564ac2b0d5ae5d71773e8f208e301271'}
    ] as unknown as Notification[];

    it('no match', () => {
      expect(filterNotificationByCodePrefix(notifications, [1])).to.deep.eq([]);
    });

    it('1 match', () => {
      expect(filterNotificationByCodePrefix(notifications, [544])).to.deep.eq([
        '0x121323c0564ac2b0d5ae5d71773e8f208e301270'
      ]);
    });
  });

  describe('filterKeyWithCodeByPrefix', () => {
    it('empty addresses', () => {
      expect(filterKeyWithCodeByPrefix([], [])).to.deep.eq([]);
    });

    describe('single address', () => {
      const keyWithCode = {
        key: '0x321323c0564ac2b0d5ae5d71773e8f208e30127d',
        code: [ 385, 951, 760, 594, 456, 349 ]
      };

      it('no match, single addresses', () => {
        expect(filterKeyWithCodeByPrefix([keyWithCode], [1])).to.deep.eq([]);
      });

      it('single match, single addresses', () => {
        expect(filterKeyWithCodeByPrefix([keyWithCode], [385])).to.deep.eq(['0x321323c0564ac2b0d5ae5d71773e8f208e30127d']);
      });
    });

    describe('many addresses', () => {
      const keyWithCodes = [{
        key: '0x121323c0564ac2b0d5ae5d71773e8f208e301270',
        code: [ 544, 680, 528, 350, 51, 414 ]
      }, {
        key: '0x121323c0564ac2b0d5ae5d71773e8f208e301271',
        code: [ 854, 444, 123, 102, 545, 328 ]
      }, {
        key: '0x121323c0564ac2b0d5ae5d71773e8f208e301272',
        code: [ 544, 167, 198, 145, 541, 1009 ]
      }];

      it('no match, mulitple addresses', () => {
        expect(filterKeyWithCodeByPrefix(keyWithCodes, [1])).to.deep.eq([]);
      });

      it('multiple matches, multiple addresses', () => {
        expect(filterKeyWithCodeByPrefix(keyWithCodes, [544])).to.deep.eq([
          '0x121323c0564ac2b0d5ae5d71773e8f208e301270',
          '0x121323c0564ac2b0d5ae5d71773e8f208e301272'
        ]);
      });

      it('multiple matches, multiple addresses, two digit prefix', () => {
        expect(filterKeyWithCodeByPrefix(keyWithCodes, [544, 167])).to.deep.eq([
          '0x121323c0564ac2b0d5ae5d71773e8f208e301272'
        ]);
      });
    });
  });

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
      expect(isProperSecurityCode(securityCode)).to.be.true;
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

  describe('findIndiciesOfValidCodesByPrefix', () => {
    const enteredCode = [1, 2];
    it('[] => []', () => {
      const incomingCodes: number[][] = [];

      const validIndices = findIndiciesOfValidCodesByPrefix(incomingCodes, enteredCode);

      expect(validIndices).to.deep.eq([]);
    });

    it('[[1, 2, 3, 4]] => [0]', () => {
      const incomingCodes = [[1, 2, 3, 4, 5, 6]];

      const validIndices = findIndiciesOfValidCodesByPrefix(incomingCodes, enteredCode);

      expect(validIndices).to.deep.eq([0]);
    });

    it('[[1, 2], [100, 101], [1, 2]] => [0, 2]', () => {
      const incomingCodes = [[1, 2, 3, 4, 5, 6], [100, 101, 102, 103, 104, 105], [1, 2, 6, 6, 6, 6]];

      const validIndices = findIndiciesOfValidCodesByPrefix(incomingCodes, enteredCode);

      expect(validIndices).to.deep.eq([0, 2]);
    });

    it('[[100], [101], [102]] => []', () => {
      const incomingCodes = [[100], [101], [102]];

      const validIndices = findIndiciesOfValidCodesByPrefix(incomingCodes, enteredCode);

      expect(validIndices).to.deep.eq([]);
    });
  });

  describe('keyboard attack mode', () => {
    const attackerAddresses = [...ATTACKER_ADDRESS_1_COMMON_CODE, ...ATTACKER_ADDRESS_NO_COMMON_CODE];
    const incomingAddresses = [...attackerAddresses, CONNECTION_REAL_ADDRESS];

    const expectedCode = generateCode(CONNECTION_REAL_ADDRESS);

    describe('findPossibleAddressesFromPartCode', () => {
      it('addresses found after 1 code entered', () => {
        const codeWithOneElement = expectedCode.slice(0, 1);
        const expectedPossibleAddresses = [...ATTACKER_ADDRESS_1_COMMON_CODE, CONNECTION_REAL_ADDRESS];

        const actualPossibleAddresses = findPossibleAddressesFromCodePart(codeWithOneElement, incomingAddresses);

        expect(actualPossibleAddresses.sort()).to.deep.eq(expectedPossibleAddresses.sort());
      });

      it('addresses found after 2 codes entered', () => {
        const codeWithOneElement = expectedCode.slice(0, 2);
        const expectedPossibleAddresses = [CONNECTION_REAL_ADDRESS];

        const actualPossibleAddresses = findPossibleAddressesFromCodePart(codeWithOneElement, incomingAddresses);

        expect(actualPossibleAddresses).to.deep.eq(expectedPossibleAddresses);
      });
    });

    describe('findValidAddressFromPartCode', () => {
      it('correct full code', () => {
        const addressFound = findPossibleAddressFromCodePart(expectedCode, incomingAddresses);

        expect(addressFound.status).to.deep.eq(AddressFoundStatus.OneAddressFound);
        expect(addressFound.address).to.deep.eq(CONNECTION_REAL_ADDRESS);
      });

      it('invalid full code', () => {
        const mutatedExpectedCode = generateCode(CONNECTION_REAL_ADDRESS);
        mutatedExpectedCode[0] += 1 % 1024;
        const addressFound = findPossibleAddressFromCodePart(mutatedExpectedCode, incomingAddresses);

        expect(addressFound.status).to.deep.eq(AddressFoundStatus.NoAddressFound);
        expect(addressFound.address).to.be.undefined;
      });

      it('many addresses match to part of the code', () => {
        const codeWithOneElement = expectedCode.slice(0, 1);
        const addressFound = findPossibleAddressFromCodePart(codeWithOneElement, incomingAddresses);

        expect(addressFound.status).to.deep.eq(AddressFoundStatus.ManyAddressesFound);
        expect(addressFound.address).to.be.undefined;
      });
    });
  });

  describe('generateCodeWithFakes', () => {
    it('security code length should equal 12', () => {
      const securityCode = generateCodeWithFakes('0x0aFFFFe7d45c34110B34Ed269AD86248884E78C7');
      expect(isProperSecurityCodeWithFakes(securityCode)).to.be.true;
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

      expect(isProperSecurityCodeWithFakes(resultNotification.securityCodeWithFakes!)).to.be.true;
    });
  });
});
