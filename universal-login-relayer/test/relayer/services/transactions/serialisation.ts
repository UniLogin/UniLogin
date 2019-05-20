import {expect} from 'chai';
import {Message} from '@universal-login/commons';
import createSignedMessage from '../../../../lib/utils/signMessage';
import {encodeDataForExecuteSigned, decodeDataForExecuteSigned} from '../../../../lib/services/transactions/serialisation';

describe('Coding transaction data', () => {
  let message: Message;
  const privateKey = '0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797';
  const encodedMessage = '0x6d633064000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000068e7780000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000020300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000417da86e9accb5ebab1da18fde3eb3b53f1a1c0ed82a8e90ef874d539f315c40615aecf309a2dcc2742a7beeb404bf1ee8b5b68864c6fcde9054c4f04b3caaac171b00000000000000000000000000000000000000000000000000000000000000';

  before(async () => {
    message = await createSignedMessage({from: '0x123'}, privateKey);
  });

  it('should correctly encode Message', () => {
    const encoded = encodeDataForExecuteSigned(message);
    expect(encoded).to.be.eq(encodedMessage);
  });

  it('should correctly decode encoded Message', () => {
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