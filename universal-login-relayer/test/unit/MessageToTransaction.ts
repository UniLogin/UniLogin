import {expect} from 'chai';
import {utils} from 'ethers';
import {TEST_ACCOUNT_ADDRESS, OPERATION_CALL} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from '../../lib/services/transactions/serialisation';
import {messageToTransaction} from '../../lib/utils/utils';

describe('MessageToTransaction', () => {
  const gasLimit = utils.bigNumberify(23000);
  const gasPrice = utils.bigNumberify(9000000);
  const contractAddress = '0x0000000000000000000000000000000000000002';

  it('should create transaction from transfer message', () => {
    const transferMessage = {
      from: contractAddress,
      to: TEST_ACCOUNT_ADDRESS,
      value: utils.parseEther('1.0'),
      data: '0x0',
      nonce: 0,
      gasToken: '0x0000000000000000000000000000000000000000',
      gasLimit,
      gasPrice,
      operationType: OPERATION_CALL,
      signature: '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba'
    };

    const expectedTransaction = {
      gasPrice,
      gasLimit,
      to: contractAddress,
      value: 0,
      data: encodeDataForExecuteSigned(transferMessage)
    };
    expect(messageToTransaction(transferMessage)).to.deep.eq(expectedTransaction);
  });
});
