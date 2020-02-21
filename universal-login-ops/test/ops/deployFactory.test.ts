import chai, {expect} from 'chai';
import {providers, Wallet} from 'ethers';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import deployFactory from '../../src/ops/deployFactory';
import deployWalletContractOnDev from '../../src/dev/deployWalletContractOnDev';

chai.use(solidity);

describe('Counterfactual factory contract', () => {
  let provider: providers.Provider;
  let wallet: Wallet;
  let walletContractAddress: string;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    const {address} = await deployWalletContractOnDev(wallet);
    walletContractAddress = address;
  });

  it('should deploy contract', async () => {
    const factoryAddress = await deployFactory(wallet, {walletContractAddress, privateKey: '', nodeUrl: ''});
    expect(factoryAddress).to.be.properAddress;
  });
});
