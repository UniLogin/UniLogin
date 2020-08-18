import {expect} from 'chai';
import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN, TEST_GAS_PRICE, TEST_GAS_LIMIT, TEST_ACCOUNT_ADDRESS, TEST_CONTRACT_ADDRESS, TEST_TOKEN_ADDRESS} from '@unilogin/commons';
import {encodeTransferToMessage} from '../../../src/core/utils/encodeTransferToMessage';
import {IERC20Interface} from '@unilogin/contracts';

describe('UNIT: encodeTransferToMessage', () => {
  const from = TEST_CONTRACT_ADDRESS;
  const to = TEST_ACCOUNT_ADDRESS;
  const gasPrice = utils.bigNumberify(TEST_GAS_PRICE);
  const gasLimit = utils.bigNumberify(TEST_GAS_LIMIT);
  const amount = '1';
  const basicMessage = {
    from,
    to,
    value: utils.parseEther(amount),
    gasLimit,
  };

  it('ether transfer and ether refund', () => {
    const gasParameters = {gasToken: ETHER_NATIVE_TOKEN.address, gasPrice};
    const transfer = {
      from,
      to,
      amount,
      token: {
        address: ETHER_NATIVE_TOKEN.address,
        decimals: 18,
      },
      gasLimit,
      gasParameters,
    };
    const expectedMessage = {
      ...basicMessage,
      data: '0x',
      gasPrice,
      gasToken: gasParameters.gasToken,
    };
    expect(encodeTransferToMessage(transfer)).to.deep.eq(expectedMessage);
  });

  it('ether transfer and token refund', () => {
    const gasParameters = {gasToken: TEST_TOKEN_ADDRESS, gasPrice};
    const transfer = {
      from,
      to,
      amount,
      gasLimit,
      token: {
        address: ETHER_NATIVE_TOKEN.address,
        decimals: 18,
      },
      gasParameters,
    };
    const expectedMessage = {
      ...basicMessage,
      data: '0x',
      gasPrice,
      gasToken: gasParameters.gasToken,
    };
    expect(encodeTransferToMessage(transfer)).to.deep.eq(expectedMessage);
  });

  it('token transfer and ether refund', () => {
    const gasParameters = {gasToken: ETHER_NATIVE_TOKEN.address, gasPrice};
    const transfer = {
      from,
      to,
      amount,
      gasLimit,
      token: {
        address: TEST_TOKEN_ADDRESS,
        decimals: 18,
      },
      gasParameters,
    };
    const expectedMessage = {
      ...basicMessage,
      data: IERC20Interface.functions.transfer.encode([to, utils.parseEther(amount)]),
      value: 0,
      to: TEST_TOKEN_ADDRESS,
      gasPrice,
      gasToken: gasParameters.gasToken,
    };
    expect(encodeTransferToMessage(transfer)).to.deep.eq(expectedMessage);
  });

  it('token transfer and ether refund', () => {
    const gasParameters = {gasToken: ETHER_NATIVE_TOKEN.address, gasPrice};
    const transfer = {
      from,
      to,
      amount,
      gasLimit,
      token: {
        address: TEST_TOKEN_ADDRESS,
        decimals: 6,
      },
      gasParameters,
    };
    const expectedMessage = {
      ...basicMessage,
      data: IERC20Interface.functions.transfer.encode([to, utils.parseUnits(amount, 6)]),
      value: 0,
      to: TEST_TOKEN_ADDRESS,
      gasPrice,
      gasToken: gasParameters.gasToken,
    };
    expect(encodeTransferToMessage(transfer)).to.deep.eq(expectedMessage);
  });

  it('token transfer and token refund', () => {
    const gasParameters = {gasToken: TEST_TOKEN_ADDRESS, gasPrice};
    const transfer = {
      from,
      to,
      amount,
      gasLimit,
      token: {
        address: TEST_TOKEN_ADDRESS,
        decimals: 18,
      },
      gasParameters,
    };
    const expectedMessage = {
      ...basicMessage,
      value: 0,
      to: TEST_TOKEN_ADDRESS,
      data: IERC20Interface.functions.transfer.encode([to, utils.parseEther(amount)]),
      gasPrice,
      gasToken: gasParameters.gasToken,
    };
    expect(encodeTransferToMessage(transfer)).to.deep.eq(expectedMessage);
  });
});
