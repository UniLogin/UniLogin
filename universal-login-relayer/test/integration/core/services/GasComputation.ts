import {expect} from 'chai';
import {utils} from 'ethers';
import {TEST_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {GasComputation} from '../../../../lib/core/services/GasComputation';

describe('GasComputation', () => {
  const gasCompution = new GasComputation();

  it('computes gas', () => {
    const message = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      gasLimit: utils.bigNumberify(100000),
      nonce: 0,
    };
    const computedGas = gasCompution.calculateGasBase(message);
    expect(computedGas).to.eq(58976);
  });
});
