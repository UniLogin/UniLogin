import {expect} from 'chai';
import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import {WalletService} from '@universal-login/sdk';
import WalletPresenter from '../../../../src/core/presenters/WalletPresenter';
import {Wallet} from 'ethers';

describe('WalletFormatter', async () => {
  let walletService: WalletService;
  let walletPresenter: WalletPresenter;
  const applicationWallet = {
    name: 'name.mylogin.eth',
    contractAddress: TEST_ACCOUNT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
  };

  beforeEach(() => {
    walletService = new WalletService({provider: Wallet.createRandom()} as any);
    walletPresenter = new WalletPresenter(walletService);
  });

  it('return name if applicationWallet exist', () => {
    walletService.setWallet(applicationWallet);
    expect(walletPresenter.getName()).to.be.eq(applicationWallet.name);
  });

  it('return empty string if applicationWallet not exist', () => {
    expect(() => walletPresenter.getName()).throws('Invalid wallet state: expected Deployed or Connecting wallet');
  });

  it('return contract address if applicationWallet exist', () => {
    walletService.setWallet(applicationWallet);
    expect(walletPresenter.getContractAddress()).to.be.eq(applicationWallet.contractAddress);
  });

  it('return empty string if applicationWallet not exist', () => {
    expect(() => walletPresenter.getContractAddress())
      .throws('Invalid wallet state: expected Deployed, Connecting or Future wallet');
  });
});
