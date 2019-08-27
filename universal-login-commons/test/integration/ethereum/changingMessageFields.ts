import {expect} from 'chai';
import {utils} from 'ethers';
import {TEST_ACCOUNT_ADDRESS, SignedMessage, createSignedMessage, MessageWithFrom, TEST_PRIVATE_KEY, bignumberifySignedMessageFields, stringifySignedMessageFields} from '../../../lib';

describe('UNIT: Parsing Transaction', () => {
  const message: MessageWithFrom = {
    from: TEST_ACCOUNT_ADDRESS,
    to: TEST_ACCOUNT_ADDRESS,
    value: utils.parseEther('2'),
    gasLimit: utils.bigNumberify(3500000),
    gasPrice: utils.bigNumberify(9000000000),
    data: utils.formatBytes32String('0'),
    nonce: '0',
    gasToken: '0x0000000000000000000000000000000000000000'
  };

  const parsedTransaction = {
    from: TEST_ACCOUNT_ADDRESS,
    to: TEST_ACCOUNT_ADDRESS,
    value: '2000000000000000000',
    gasLimit: '3500000',
    gasPrice: '9000000000',
    data: '0x3000000000000000000000000000000000000000000000000000000000000000',
    nonce: '0',
    gasToken: '0x0000000000000000000000000000000000000000',
    signature: '0x47589f51820002497726d60e01ec59c1424b9b3beaa07593f56c196bad68f40c0a34db040f1bd6f65b99729c5925d7bdfcaf76414de4bb5738cc78571c1549151c'
  };

  let signedMessage: SignedMessage;

  before(async () => {
    signedMessage = createSignedMessage(message, TEST_PRIVATE_KEY);
  });

  it('should parse BigNumber to string', () => {
    expect(stringifySignedMessageFields(signedMessage)).to.deep.equal(parsedTransaction);
  });

  it('should parse string to BigNumber', () => {
    expect(bignumberifySignedMessageFields(parsedTransaction)).to.deep.equal(signedMessage);
  });
});
