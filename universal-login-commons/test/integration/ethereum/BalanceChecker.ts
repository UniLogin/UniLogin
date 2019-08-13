import chai, {expect} from 'chai';
import {providers, Wallet, utils, Contract, ethers} from 'ethers';
import {createMockProvider, getWallets, solidity, deployContract} from 'ethereum-waffle';
import {BalanceChecker} from '../../../lib/integration/ethereum/BalanceChecker';
import {ETHER_NATIVE_TOKEN} from '../../../lib/core/constants/constants';
import MockToken from '../../fixtures/MockToken.json';
import {TEST_ACCOUNT_ADDRESS} from '../../../lib/core/constants/test';
import {WeiPerEther} from 'ethers/constants';

chai.use(solidity);

describe('INT: BalanceChecker', async () => {
  let provider: providers.Provider;
  let balanceChecker: BalanceChecker;
  let wallet: Wallet;
  let mockToken: Contract;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    balanceChecker = new BalanceChecker(provider);
  });

  describe('ETH', async () => {
    it('0 ETH', async () => {
      const balance = await balanceChecker.getBalance(TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN.address);
      expect(balance).to.equal('0');
    });

    it('1 ETH', async () => {
      await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('1')});
      const balance = await balanceChecker.getBalance(TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN.address);
      expect(balance).to.equal(WeiPerEther);
    });
  });

  describe('ERC20 token', async () => {
    beforeEach(async () => {
      mockToken = await deployContract(wallet, MockToken);
    });

    it('0 tokens', async () => {
      const balance = await balanceChecker.getBalance(TEST_ACCOUNT_ADDRESS, mockToken.address);
      expect(balance).to.equal('0');
    });

    it('1 token', async () => {
      await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.bigNumberify('1'));
      const balance = await balanceChecker.getBalance(TEST_ACCOUNT_ADDRESS, mockToken.address);
      expect(balance).to.equal(ethers.constants.One);
    });

    it('not deployed', async () => {
      await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.bigNumberify('1'));
      await expect(balanceChecker.getBalance(TEST_ACCOUNT_ADDRESS, '0x000000000000000000000000000000000000DEAD'))
        .to.be.rejectedWith('contract not deployed');
    });
  });
});
