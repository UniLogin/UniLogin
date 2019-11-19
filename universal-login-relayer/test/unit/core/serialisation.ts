import {expect} from 'chai';
import {SignedMessage} from '@universal-login/commons';
import {encodeDataForExecuteSigned, messageToSignedMessage} from '@universal-login/contracts';
import {decodeDataForExecuteSigned} from '../../../lib/core/utils/messages/serialisation';
import {transferMessage} from '../../fixtures/basicWalletContract';

describe('UNIT: Coding transaction data', () => {
  let message: SignedMessage;
  const privateKey = '0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797';
  const encodedMessage = '0xa9cf197e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000006f05b59d3b20000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000002540be40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000026678000000000000000000000000000000000000000000000000000000000000a6c80000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000002030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041ebcf87ecaca2bb1c8fda8c6e51203bc63aa98e8c7f40cf4dab81bfd61cd41c2258a04bf6462838805f784e9b741d5f16b4b17be26a7e0d3e689e263adf3cb2331c00000000000000000000000000000000000000000000000000000000000000';

  before(async () => {
    message = messageToSignedMessage({...transferMessage, from: '0x123'}, privateKey);
  });

  it('should correctly encode SignedMessage', () => {
    const encoded = encodeDataForExecuteSigned(message);
    expect(encoded).to.be.eq(encodedMessage);
  });

  it('should correctly decode encoded SignedMessage', () => {
    const {from, nonce, ...messageWithoutFromAndNonce} = message;
    const decoded = decodeDataForExecuteSigned(encodedMessage);
    expect(decoded).to.deep.eq(messageWithoutFromAndNonce);
  });

  it('message without from property shoud be equal decoded message', () => {
    const {from, ...messageWithoutFrom} = message;
    const encoded = encodeDataForExecuteSigned(message);
    const decoded = decodeDataForExecuteSigned(encoded);
    const {nonce, ...messageWithoutNonce} = messageWithoutFrom;
    expect(decoded).to.deep.eq(messageWithoutNonce);
  });
});
