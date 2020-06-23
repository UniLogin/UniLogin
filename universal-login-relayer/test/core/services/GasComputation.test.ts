import {DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN, OperationType, TEST_CONTRACT_ADDRESS, ProviderService} from '@unilogin/commons';
import {ContractService} from '@unilogin/contracts';
import {setupWalletContract} from '@unilogin/contracts/testutils';
import {expect} from 'chai';
import {MockProvider} from 'ethereum-waffle';
import {Contract, utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {GasComputation} from '../../../src/core/services/GasComputation';

describe('GasComputation', () => {
  let gasComputation: GasComputation;
  let proxyWallet: Contract;

  before(async () => {
    const provider = new MockProvider();
    const providerService = new ProviderService(provider);
    const contractService = new ContractService(providerService);
    gasComputation = new GasComputation(contractService, providerService);
    const [wallet] = provider.getWallets();
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
      operationType: OperationType.call,
      refundReceiver: AddressZero,
    };
    const computedGas = await gasComputation.calculateBaseGas(message);
    expect(computedGas).to.eq(58976);
  });
});
