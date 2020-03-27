import {SignedMessage} from '@unilogin/commons';
import {encodeDataForExecuteSigned} from '@unilogin/contracts';
import {expect} from 'chai';
import {decodeDataForExecuteSigned} from '../../../src/core/utils/messages/serialisation';
import {getTestSignedMessage} from '../../testconfig/message';
import {transferMessage} from '../../fixtures/basicWalletContract';

describe('UNIT: Coding transaction data', () => {
  let message: SignedMessage;
  const privateKey = '0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797';
  const encodedMessage = '0xa9cf197e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000006f05b59d3b20000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000002540be4000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006bfc0000000000000000000000000000000000000000000000000000000000000e16000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000020300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000413ebbf66234b26ef8c7677661f9cc29f37ead09d3445d18adef21c827d59fc637078d2aee32200d5ff9340950522c7e5dcf1a3a89a90bc46128b14903d725f8be1c00000000000000000000000000000000000000000000000000000000000000';

  before(async () => {
    message = getTestSignedMessage({...transferMessage, from: '0x123'}, privateKey);
  });

  it('should correctly encode SignedMessage', () => {
    const encoded = encodeDataForExecuteSigned(message);
    expect(encoded).to.eq(encodedMessage);
  });

  it('should correctly decode encoded SignedMessage', () => {
    const {from, nonce, operationType, refundReceiver, ...messageWithoutFromAndNonce} = message;
    const decoded = decodeDataForExecuteSigned(encodedMessage);
    expect(decoded).to.deep.eq(messageWithoutFromAndNonce);
  });

  it('message without from property shoud be equal decoded message', () => {
    const {from, operationType, refundReceiver, ...messageWithoutFrom} = message;
    const encoded = encodeDataForExecuteSigned(message);
    const decoded = decodeDataForExecuteSigned(encoded);
    const {nonce, ...messageWithoutNonce} = messageWithoutFrom;
    expect(decoded).to.deep.eq(messageWithoutNonce);
  });
});
