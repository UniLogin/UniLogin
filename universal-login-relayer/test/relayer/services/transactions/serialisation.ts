import {expect} from 'chai';
import {Message} from '@universal-login/commons';
import createSignedMessage from '../../../helpers/message';
import {encodeDataForExecuteSigned, decodeDataForExecuteSigned} from '../../../../lib/services/transactions/serialisation';

describe('Coding transaction data', () => {
  let message: Message;
  const privateKey = '0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797';
  const encodedMessage = '0x6d633064000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000006f05b59d3b200000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000068e7780000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004183fcf4412dbadbc04f7017d971ec7e4b81247aaaa69c3fee7f04c033cbeb9df00247486dbc0374d291b0e76cc5475fe9831268fcdee5b953df68e9e9132f75961c00000000000000000000000000000000000000000000000000000000000000';

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