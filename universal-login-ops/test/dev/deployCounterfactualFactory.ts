import chai, {expect} from 'chai';
import {providers, Wallet} from 'ethers';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import deployFactory from '../../src/ops/deployFactory';

chai.use(solidity);

describe('Counterfactual factory contract', async () => {
  let provider: providers.Provider;
  let wallet: Wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
  });

  it('should deploy contract', async () => {
    const factoryAddress = await deployFactory(wallet);
    expect(factoryAddress).to.be.properAddress;
  });
});
