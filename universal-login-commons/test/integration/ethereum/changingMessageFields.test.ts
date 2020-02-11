import {expect} from 'chai';
import {utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {
  TEST_ACCOUNT_ADDRESS,
  SignedMessage,
  TEST_PRIVATE_KEY,
  bignumberifySignedMessageFields,
  stringifySignedMessageFields,
  EMPTY_DATA,
  calculateMessageSignature,
  OperationType,
} from '../../../src';

describe('UNIT: Parsing Transaction', () => {
  const message = {
    from: TEST_ACCOUNT_ADDRESS,
    to: TEST_ACCOUNT_ADDRESS,
    value: utils.parseEther('2'),
    safeTxGas: utils.bigNumberify(3500000),
    gasPrice: utils.bigNumberify(9000000000),
    baseGas: utils.bigNumberify(0),
    data: EMPTY_DATA,
    nonce: '0',
    operationType: OperationType.call,
    refundReceiver: AddressZero,
    gasToken: AddressZero,
  };

  const parsedTransaction = {
    from: TEST_ACCOUNT_ADDRESS,
    to: TEST_ACCOUNT_ADDRESS,
    value: '2000000000000000000',
    safeTxGas: '3500000',
    gasPrice: '9000000000',
    baseGas: '0',
    data: '0x3000000000000000000000000000000000000000000000000000000000000000',
    nonce: '0',
    operationType: OperationType.call,
    refundReceiver: AddressZero,
    gasToken: AddressZero,
    signature: '0x45fe0bf06270a46741ef85b8594b3b8e78cb3a4e382056bb43b580e4823bdb2e7688d54d40413a1a52fedd7870c4da48289738b14fb4dc8ac6790aaa7b3cfaa41c',
  };

  let signedMessage: SignedMessage;

  before(async () => {
    signedMessage = {...message, signature: calculateMessageSignature(TEST_PRIVATE_KEY, message)};
  });

  it('should parse BigNumber to string', () => {
    expect(stringifySignedMessageFields(signedMessage)).to.deep.eq(parsedTransaction);
  });

  it('should parse string to BigNumber', () => {
    expect(bignumberifySignedMessageFields(parsedTransaction)).to.deep.eq(signedMessage);
  });
});
