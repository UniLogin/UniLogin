import chai, {expect} from 'chai';
import {providers, Wallet} from 'ethers';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import deployFactory from '../../src/ops/deployFactory';
import deployWalletMaster from '../../src/dev/deployWalletMaster';

chai.use(solidity);

describe('Counterfactual factory contract', async () => {
  let provider: providers.Provider;
  let wallet: Wallet;
  let walletMasterAddress: string;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    const {address} = await deployWalletMaster(wallet);
    walletMasterAddress = address;
  });

  it('should deploy contract', async () => {
    const factoryAddress = await deployFactory(wallet, walletMasterAddress);
    expect(factoryAddress).to.be.properAddress;
  });
});
