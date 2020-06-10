import {emptyMessage} from '@unilogin/contracts/testutils';
import {Message, TEST_GAS_PRICE, TEST_ACCOUNT_ADDRESS, estimateGas, DEFAULT_GAS_LIMIT} from '../../../src';
import {AddressZero} from 'ethers/constants';
import {bigNumberify} from 'ethers/utils';

describe('UNIT: estimateGas', async () => {
  let message: Message;

  beforeEach(async () => {
    message = {...emptyMessage, gasPrice: TEST_GAS_PRICE, from: AddressZero, to: TEST_ACCOUNT_ADDRESS, value: bigNumberify(2)};
  });

  it('estimate gas', async () => {
    console.log('EstimatedGas: ', await estimateGas(message));
    console.log('Our Gas: ', DEFAULT_GAS_LIMIT);
  });
});
