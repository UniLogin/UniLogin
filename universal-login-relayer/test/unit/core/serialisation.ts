import {expect} from 'chai';
import {SignedMessage} from '@universal-login/commons';
import {encodeDataForExecuteSigned, messageToSignedMessage} from '@universal-login/contracts';
import {decodeDataForExecuteSigned} from '../../../lib/core/utils/messages/serialisation';
import {transferMessage} from '../../fixtures/basicWalletContract';

describe('UNIT: Coding transaction data', () => {
  let message: SignedMessage;
  const privateKey = '0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797';
  const encodedMessage = '0xa9cf197e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000006f05b59d3b20000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000002540be400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000783100000000000000000000000000000000000000000000000000000000000001e10000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000203000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004169d887fb663789c5c1e440d5db47dd3bece8f7c216e21a275fbc763251ba5b873890795da3067b48ffbfa5ca02a50ae95aa4d23e74627eb1e3eeff6bd21d3be01b00000000000000000000000000000000000000000000000000000000000000';

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
