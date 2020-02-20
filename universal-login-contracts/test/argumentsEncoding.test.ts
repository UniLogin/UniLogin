import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity} from 'ethereum-waffle';
import {utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {TEST_ACCOUNT_ADDRESS, UnsignedMessage, OperationType} from '@unilogin/commons';
import {getExecutionArgs} from './helpers/argumentsEncoding';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('getExecutionArgs', () => {
  it('should return corect array', () => {
    const msg: UnsignedMessage = {
      from: TEST_ACCOUNT_ADDRESS,
      to: TEST_ACCOUNT_ADDRESS,
      value: utils.parseEther('1.0'),
      data: '0x0',
      nonce: 0,
      gasPrice: 0,
      safeTxGas: 0,
      gasToken: '0x0000000000000000000000000000000000000000',
      baseGas: 68,
      operationType: OperationType.call,
      refundReceiver: AddressZero,
    };
    const expectedResult = [
      TEST_ACCOUNT_ADDRESS,
      utils.parseEther('1.0'),
      '0x0',
      0,
      '0x0000000000000000000000000000000000000000',
      0,
      68,
    ];
    expect(getExecutionArgs(msg)).to.deep.eq(expectedResult);
  });
});
