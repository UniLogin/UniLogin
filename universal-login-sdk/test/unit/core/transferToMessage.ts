import {expect} from 'chai';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN, TEST_GAS_PRICE, TEST_ACCOUNT_ADDRESS, TEST_CONTRACT_ADDRESS, TEST_TOKEN_ADDRESS} from '@universal-login/commons';
import {transferToMessage} from '../../../lib/core/utils/transferToMessage';

describe('UNIT: transferDetailsToMessage', () => {
  const from = TEST_CONTRACT_ADDRESS;
  const to = TEST_ACCOUNT_ADDRESS;
  const gasPrice = utils.bigNumberify(TEST_GAS_PRICE);
  const amount = '1';
  const basicMessage = {
    from,
    to,
    value: utils.parseEther(amount),
  };

  it('ether transfer and ether refund', () => {
    const gasParameters = {gasToken: ETHER_NATIVE_TOKEN.address, gasPrice};
    const transfer = {
      from,
      to,
      amount,
      transferToken: ETHER_NATIVE_TOKEN.address,
      gasParameters,
    };
    const expectedMessage = {
      ...basicMessage,
      data: '0x',
      gasPrice,
      gasToken: gasParameters.gasToken,
    };
    expect(transferToMessage(transfer)).to.deep.eq(expectedMessage);
  });

  it('ether transfer and token refund', () => {
    const gasParameters = {gasToken: TEST_TOKEN_ADDRESS, gasPrice};
    const transfer = {
      from,
      to,
      amount,
      transferToken: ETHER_NATIVE_TOKEN.address,
      gasParameters,
    };
    const expectedMessage = {
      ...basicMessage,
      data: '0x',
      gasPrice,
      gasToken: gasParameters.gasToken,
    };
    expect(transferToMessage(transfer)).to.deep.eq(expectedMessage);
  });

  it('token transfer and ether refund', () => {
    const gasParameters = {gasToken: ETHER_NATIVE_TOKEN.address, gasPrice};
    const transfer = {
      from,
      to,
      amount,
      transferToken: TEST_TOKEN_ADDRESS,
      gasParameters,
    };
    const expectedMessage = {
      ...basicMessage,
      data: new utils.Interface(IERC20.abi).functions.transfer.encode([to, utils.parseEther(amount)]),
      value: 0,
      to: TEST_TOKEN_ADDRESS,
      gasPrice,
      gasToken: gasParameters.gasToken,
    };
    expect(transferToMessage(transfer)).to.deep.eq(expectedMessage);
  });

  it('token transfer and token refund', () => {
    const gasParameters = {gasToken: TEST_TOKEN_ADDRESS, gasPrice};
    const transfer = {
      from,
      to,
      amount,
      transferToken: TEST_TOKEN_ADDRESS,
      gasParameters,
    };
    const expectedMessage = {
      ...basicMessage,
      value: 0,
      to: TEST_TOKEN_ADDRESS,
      data: new utils.Interface(IERC20.abi).functions.transfer.encode([to, utils.parseEther(amount)]),
      gasPrice,
      gasToken: gasParameters.gasToken,
    };
    expect(transferToMessage(transfer)).to.deep.eq(expectedMessage);
  });
});
