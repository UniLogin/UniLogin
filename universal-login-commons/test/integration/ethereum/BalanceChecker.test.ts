import chai, {expect} from 'chai';
import {Wallet, utils, Contract, ethers} from 'ethers';
import {solidity, deployContract, MockProvider} from 'ethereum-waffle';
import {BalanceChecker} from '../../../src/integration/ethereum/BalanceChecker';
import {ETHER_NATIVE_TOKEN} from '../../../src/core/constants/constants';
import MockToken from '../../fixtures/MockToken.json';
import {TEST_ACCOUNT_ADDRESS} from '../../../src/core/constants/test';
import {WeiPerEther} from 'ethers/constants';
import {ProviderService} from '../../../src/integration/ethereum/ProviderService';

chai.use(solidity);

describe('INT: BalanceChecker', () => {
  let provider: MockProvider;
  let balanceChecker: BalanceChecker;
  let wallet: Wallet;
  let mockToken: Contract;

  beforeEach(() => {
    provider = new MockProvider();
    [wallet] = provider.getWallets();
    balanceChecker = new BalanceChecker(new ProviderService(provider));
  });

  describe('ETH', () => {
    it('0 ETH', async () => {
      const balance = await balanceChecker.getBalance(TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN.address);
      expect(balance).to.eq('0');
    });

    it('1 ETH', async () => {
      await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('1')});
      const balance = await balanceChecker.getBalance(TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN.address);
      expect(balance).to.eq(WeiPerEther);
    });
  });

  describe('ERC20 token', () => {
    beforeEach(async () => {
      mockToken = await deployContract(wallet, MockToken);
    });

    it('0 tokens', async () => {
      const balance = await balanceChecker.getBalance(TEST_ACCOUNT_ADDRESS, mockToken.address);
      expect(balance).to.eq('0');
    });

    it('1 token', async () => {
      await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.bigNumberify('1'));
      const balance = await balanceChecker.getBalance(TEST_ACCOUNT_ADDRESS, mockToken.address);
      expect(balance).to.eq(ethers.constants.One);
    });

    it('not deployed', async () => {
      await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.bigNumberify('1'));
      await expect(balanceChecker.getBalance(TEST_ACCOUNT_ADDRESS, '0x000000000000000000000000000000000000DEAD'))
        .to.be.rejectedWith('Invalid contract address: 0x000000000000000000000000000000000000DEAD');
    });
  });
});
