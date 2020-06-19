import chai, {expect} from 'chai';
import {Wallet} from 'ethers';
import {solidity, MockProvider} from 'ethereum-waffle';
import deployFactory from '../../src/ops/deployFactory';
import deployWalletContractOnDev from '../../src/dev/deployWalletContractOnDev';

chai.use(solidity);

describe('Counterfactual factory contract', () => {
  let provider: MockProvider;
  let wallet: Wallet;
  let walletContractAddress: string;

  beforeEach(async () => {
    provider = new MockProvider();
    [wallet] = provider.getWallets();
    const {address} = await deployWalletContractOnDev(wallet);
    walletContractAddress = address;
  });

  it('should deploy contract', async () => {
    const factoryAddress = await deployFactory(wallet, {walletContractAddress, privateKey: '', nodeUrl: ''});
    expect(factoryAddress).to.be.properAddress;
  });
});
