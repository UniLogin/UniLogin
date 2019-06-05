import {expect} from 'chai';
import {utils} from 'ethers';
import {TEST_ACCOUNT_ADDRESS, SignedMessage, createSignedMessage, MessageWithFrom, OPERATION_CALL} from '@universal-login/commons';
import {bignumberifySignedMessageFields, stringifySignedMessageFields} from '../../lib/utils/changingTransactionFields';

describe('UNIT: Parsing Transaction', () => {
  const privateKey = '0x63f01680950dc70f2eb8f373de0c360fcbb89ef437f2f6f2f0a1797979e490a4';
  const message: MessageWithFrom = {
    from: TEST_ACCOUNT_ADDRESS,
    to: TEST_ACCOUNT_ADDRESS,
    value: utils.parseEther('2'),
    gasLimit: utils.bigNumberify(3500000),
    gasPrice: utils.bigNumberify(9000000000),
    data: utils.formatBytes32String('0'),
    nonce: 0,
    gasToken: '0x0000000000000000000000000000000000000000',
    operationType: OPERATION_CALL
  };

  const parsedTransaction = {
    from: TEST_ACCOUNT_ADDRESS,
    to: TEST_ACCOUNT_ADDRESS,
    value: '2000000000000000000',
    gasLimit: '3500000',
    gasPrice: '9000000000',
    data: '0x3000000000000000000000000000000000000000000000000000000000000000',
    nonce: 0,
    gasToken: '0x0000000000000000000000000000000000000000',
    operationType: OPERATION_CALL,
    signature: '0x45fe0bf06270a46741ef85b8594b3b8e78cb3a4e382056bb43b580e4823bdb2e7688d54d40413a1a52fedd7870c4da48289738b14fb4dc8ac6790aaa7b3cfaa41c'
  };

  let signedMessage: SignedMessage;

  before(async () => {
    signedMessage = await createSignedMessage(message, privateKey);
  });

  it('should parse BigNumber to string', () => {
    expect(stringifySignedMessageFields(signedMessage)).to.deep.equal(parsedTransaction);
  });

  it('should parse string to BigNumber', () => {
    expect(bignumberifySignedMessageFields(parsedTransaction)).to.deep.equal(signedMessage);
  });
});
