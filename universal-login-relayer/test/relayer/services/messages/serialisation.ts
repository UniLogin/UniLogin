import {expect} from 'chai';
import {createSignedMessage, SignedMessage, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from '@universal-login/contracts';
import {decodeDataForExecuteSigned} from '../../../../lib/services/transactions/serialisation';

describe('Coding transaction data', () => {
  let message: SignedMessage;
  const privateKey = '0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797';
  const encodedMessage = '0x6d6330640000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003b9aca00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000002030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041369b63ba9dbc20e9e5568fcb801126aba459932f4fe995782cc868cacb4d5c1329be193f10f274c98fc158942bace1066aa38ff251509b00a350222308aee4af1b00000000000000000000000000000000000000000000000000000000000000';

  before(async () => {
    message = await createSignedMessage({from: '0x123', to: TEST_ACCOUNT_ADDRESS}, privateKey);
  });

  it('should correctly encode SignedMessage', () => {
    const encoded = encodeDataForExecuteSigned(message);
    expect(encoded).to.be.eq(encodedMessage);
  });

  it('should correctly decode encoded SignedMessage', () => {
    const {from, ...messageWithoutFrom} = message;
    const decoded = decodeDataForExecuteSigned(encodedMessage);
    expect(decoded).to.deep.eq(messageWithoutFrom);
  });

  it('message without from property shoud be equal decoded message', () => {
    const {from, ...messageWithoutFrom} = message;
    const encoded = encodeDataForExecuteSigned(message);
    const decoded = decodeDataForExecuteSigned(encoded);
    expect(decoded).to.deep.eq(messageWithoutFrom);
  });
});
