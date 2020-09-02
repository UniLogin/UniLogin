import {expect} from 'chai';
import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY} from '@unilogin/commons';
import {WalletService} from '@unilogin/sdk';
import WalletPresenter from '../../src/core/presenters/WalletPresenter';
import {Wallet} from 'ethers';

describe('WalletPresenter', () => {
  let walletService: WalletService;
  let walletPresenter: WalletPresenter;
  const applicationWallet = {
    name: 'name.mylogin.eth',
    contractAddress: TEST_ACCOUNT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
  };

  beforeEach(() => {
    walletService = new WalletService({provider: Wallet.createRandom(), config: {network: 'ganache'}} as any);
    walletPresenter = new WalletPresenter(walletService);
  });

  it('return name if applicationWallet exist', () => {
    walletService.setWallet(applicationWallet);
    expect(walletPresenter.getName()).to.eq(applicationWallet.name);
  });

  it('return empty string if applicationWallet not exist', () => {
    expect(() => walletPresenter.getName()).throws('Invalid wallet state: expected Deployed or Connecting wallet');
  });

  it('return contract address if applicationWallet exist', () => {
    walletService.setWallet(applicationWallet);
    expect(walletPresenter.getContractAddress()).to.eq(applicationWallet.contractAddress);
  });

  it('return empty string if applicationWallet not exist', () => {
    expect(() => walletPresenter.getContractAddress())
      .throws('Invalid wallet state: expected Deployed, DeployedWithoutEmail, Connecting or Future wallet');
  });
});
