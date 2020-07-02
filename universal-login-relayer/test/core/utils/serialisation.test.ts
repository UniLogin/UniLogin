import {SignedMessage} from '@unilogin/commons';
import {encodeDataForExecuteSigned} from '@unilogin/contracts';
import {expect} from 'chai';
import {decodeDataForExecuteSigned} from '../../../src/core/utils/messages/serialisation';
import {getTestSignedMessage} from '../../testconfig/message';
import {transferMessage} from '../../fixtures/basicWalletContract';

describe('UNIT: Coding transaction data', () => {
  let message: SignedMessage;
  const privateKey = '0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797';
  const encodedMessage = '0xa9cf197e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000006f05b59d3b20000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000004a817c8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006bfc0000000000000000000000000000000000000000000000000000000000000e1600000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000002030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041eb14ba5efea6cb6956cb305d662a4eb9096d788ea8e483b721ec87992b3dba383f79bc24d37324733e1e0387ffc7fba33aa2a5fad52201e6c6a86f6f4b543cc11b00000000000000000000000000000000000000000000000000000000000000';

  before(() => {
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
