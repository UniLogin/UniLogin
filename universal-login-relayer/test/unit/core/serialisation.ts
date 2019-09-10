import {expect} from 'chai';
import {createSignedMessage, SignedMessage, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from '@universal-login/contracts';
import {decodeDataForExecuteSigned} from '../../../lib/core/utils/messages/serialisation';

describe('UNIT: Coding transaction data', () => {
  let message: SignedMessage;
  const privateKey = '0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797';
  const encodedMessage = '0xa9cf197e00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000002540be400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000002030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041ae4e8475c1de692311b18b9cd8172578f13d7ca26009f2bc129c24dd426ee1cf066130a2a97628a1e1ebff914a8f3d72a9bf153b844b694b2f778b76f910e6e01b00000000000000000000000000000000000000000000000000000000000000';

  before(async () => {
    message = createSignedMessage({from: '0x123', to: TEST_ACCOUNT_ADDRESS}, privateKey);
  });

  it('should correctly encode SignedMessage', () => {
    const encoded = encodeDataForExecuteSigned(message);
    expect(encoded).to.be.eq(encodedMessage);
  });

  it('should correctly decode encoded SignedMessage', () => {
    const {from, ...messageWithoutFrom} = message;
    const decoded = decodeDataForExecuteSigned(encodedMessage);
    const {nonce, ...messageWithoutNonce} = messageWithoutFrom;
    expect(decoded).to.deep.eq(messageWithoutNonce);
  });

  it('message without from property shoud be equal decoded message', () => {
    const {from, ...messageWithoutFrom} = message;
    const encoded = encodeDataForExecuteSigned(message);
    const decoded = decodeDataForExecuteSigned(encoded);
    const {nonce, ...messageWithoutNonce} = messageWithoutFrom;
    expect(decoded).to.deep.eq(messageWithoutNonce);
  });
});
