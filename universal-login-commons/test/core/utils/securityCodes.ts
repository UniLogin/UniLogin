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

  describe('keyboard attack mode', () => {
    const realAddress = '0xee2C70026a0E36ccC7B9446b57BA2bD98c28930b';
    const expectedCode = generateCode(realAddress);
    const addressesThatDontShareBytesWithRealAddress = [
      '0x9a2c510AA7E56B83AFe6834f83C24512bafD7318',
      '0xC633cE261FfE65950ef74DDF05b8A953fAFfc095',
      '0x45D4dBF0F3FCb3E154e6CAbA60E80105032e1DF7',
      '0x95719d7001097A0be2fe3fcDF74efaa2A967714E',
      '0x16925cd9D4985016D1816b24b1707F0D9116C01e'
    ];
    const addressesThatShareFirstCodeWithRealAddress = [
      '0x49c9A6784C061D298f9021a07eC218382feE20A9',
      '0xf247e3c2f118763f79BE7C226D1c3dB988004704',
      '0x22A6F13A956e7235fd989329da6e504523EE9346',
      '0xd856550341C0772BC8f02E8E30DcD43239677084',
      '0x69a4de9CF98FFf3D019F85C2d0aeb3860C179EBC'
    ];

    const attackerAddresses = addressesThatDontShareBytesWithRealAddress.concat(addressesThatShareFirstCodeWithRealAddress);
    const incomingAddresses = attackerAddresses.concat([realAddress]);

    describe('findPossibleAddressesFromPartCode', () => {
      it('addresses found after 1 code entered', () => {
        const codeWithOneElement = expectedCode.slice(0, 1);
        const expectedPossibleAddresses = addressesThatShareFirstCodeWithRealAddress.concat([realAddress]);

        const actualPossibleAddresses = findPossibleAddressesFromPartCode(codeWithOneElement, incomingAddresses);

        expect(actualPossibleAddresses.sort()).to.deep.eq(expectedPossibleAddresses.sort());
      });

      it('addresses found after 2 codes entered', () => {
        const codeWithOneElement = expectedCode.slice(0, 2);
        const expectedPossibleAddresses = [realAddress];

        const actualPossibleAddresses = findPossibleAddressesFromPartCode(codeWithOneElement, incomingAddresses);

        expect(actualPossibleAddresses).to.deep.eq(expectedPossibleAddresses);
      });
    });

    describe('findValidAddressFromPartCode', () => {
      it('correct full code', () => {
        const findResult = findValidAddressFromPartCode(expectedCode, incomingAddresses);

        expect(findResult).to.deep.eq(realAddress);
      });

      it('invalid full code', () => {
        expectedCode[0] += 1 % 1024;
        const findResult = findValidAddressFromPartCode(expectedCode, incomingAddresses);

        expect(findResult).to.be.undefined;
      });

      it('many addresses match to part of the code', () => {
        const codeWithOneElement = expectedCode.slice(0, 1);
        const findResult = findValidAddressFromPartCode(codeWithOneElement, incomingAddresses);

        expect(findResult).to.be.undefined;
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
