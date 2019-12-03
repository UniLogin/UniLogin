import {expect} from 'chai';
import {utils, Contract} from 'ethers';
import {TEST_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {GasComputation} from '../../../../lib/core/services/GasComputation';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {BlockchainService} from '@universal-login/contracts';
import {setupWalletContract} from '@universal-login/contracts/testutils';

describe('GasComputation', () => {
  let gasComputation: GasComputation;
  let proxyWallet: Contract;

  before(async () => {
    const provider = createMockProvider();
    const blockchainService = new BlockchainService(provider);
    gasComputation = new GasComputation(blockchainService);
    const [wallet] = getWallets(provider);
    ({proxyWallet} = await setupWalletContract(wallet));
  });

  it('computes gas', async () => {
    const message = {
      from: proxyWallet.address,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      gasLimit: utils.bigNumberify(100000),
      nonce: 0,
    };
    const computedGas = await gasComputation.calculateGasBase(message);
    expect(computedGas).to.eq(58976);
  });
});
