import chai, {expect} from 'chai';
import {createMockProvider, deployContract, getWallets, solidity, contractWithWallet} from 'ethereum-waffle';
import Token from '../../build/Token';
chai.use(solidity);

describe('Universal Login Token', async () => {
  let provider;
  let wallet;
  let contract;
  let totalSupply;
  let anotherWallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, anotherWallet] = await getWallets(provider);
    contract = await deployContract(wallet, Token);
    totalSupply = await contract.totalSupply();
  });

  describe('Basic functions', async () => {
    it('has proper address', async () => {
      expect(contract.address).to.not.be.null;
    })

    it('total supply is not equal 0', async () => {
      expect(totalSupply).to.not.be.null;
    });

    it('owner balance is equal totalSupply', async () => {
      expect(await contract.balanceOf(wallet.address)).to.eq(totalSupply);
    });

    it('transfer tokens', async () => {
      await contract.transfer(anotherWallet.address, 25);
      expect(await contract.balanceOf(anotherWallet.address)).to.eq(25);
    });
  });
});