import {expect} from 'chai';
import {Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {setupGnosisSafeContractFixture} from '../../fixtures/gnosisSafe';
import {TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {calculateMessageHash} from '../../../src/gnosis-safe@1.1.1/utils';

describe('calculateMessageHash', () => {
  let proxy: Contract;

  before(async () => {
    ({proxy} = await loadFixture(setupGnosisSafeContractFixture));
  });

  it('calculate transaction hash works', async () => {
    const msg = {
      to: TEST_ACCOUNT_ADDRESS,
      value: 0,
      operationType: 1,
      safeTxGas: '580000',
      baseGas: '200000',
      refundReceiver: TEST_ACCOUNT_ADDRESS,
      data: '0x0',
      nonce: 0,
      gasPrice: 1,
      from: proxy.address,
      gasToken: ETHER_NATIVE_TOKEN.address,
    };
    expect(await proxy.getTransactionHash(
      msg.to,
      msg.value,
      msg.data,
      msg.operationType,
      msg.safeTxGas,
      msg.baseGas,
      msg.gasPrice,
      msg.gasToken,
      msg.refundReceiver,
      msg.nonce)).to.eq(calculateMessageHash(msg));
  });
});
