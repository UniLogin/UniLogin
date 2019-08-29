import chai, {expect} from 'chai';
import {providers, Wallet} from 'ethers';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import deployFactory from '../../src/ops/deployFactory';
import deployWalletContract from '../../src/dev/deployWalletContract';

chai.use(solidity);

describe('Counterfactual factory contract', async () => {
  let provider: providers.Provider;
  let wallet: Wallet;
  let walletContractAddress: string;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    const {address} = await deployWalletContract(wallet);
    walletContractAddress = address;
  });

  it('should deploy contract', async () => {
    const factoryAddress = await deployFactory(wallet, walletContractAddress);
    expect(factoryAddress).to.be.properAddress;
  });
});
