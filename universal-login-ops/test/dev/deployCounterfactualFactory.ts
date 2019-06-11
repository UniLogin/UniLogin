import chai, {expect} from 'chai';
import {providers, Wallet} from 'ethers';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import deployCounterfactualFactory from '../../src/ops/deployCounterfactualFactory';

chai.use(solidity);

describe('Counterfactual factory contract', async () => {
  let provider: providers.Provider;
  let wallet: Wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
  });

  it('should deploy contract', async () => {
    const {counterfactualHash, counterfactualAddress} = await deployCounterfactualFactory(wallet);
    expect(counterfactualAddress).to.be.properAddress;
    expect(counterfactualHash).to.be.properHex(64);
    const transactionReceipt = await provider.getTransactionReceipt(counterfactualHash!);
    expect(transactionReceipt.contractAddress).to.be.eq(counterfactualAddress);
  });
});
