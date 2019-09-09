import {expect} from 'chai';
import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import WalletPresenter from '../../../../src/core/presenters/WalletPresenter';

describe('WalletFormatter', async () => {
  let walletService: WalletService;
  let walletPresenter: WalletPresenter;
  const applicationWallet = {
    name: 'name.mylogin.eth',
    contractAddress: TEST_ACCOUNT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY
  };

  beforeEach(() => {
    walletService = new WalletService({} as UniversalLoginSDK);
    walletPresenter = new WalletPresenter(walletService);
  });

  it('return name if applicationWallet exist', () => {
    walletService.connect(applicationWallet);
    expect(walletPresenter.getName()).to.be.eq(applicationWallet.name);
  });

  it('return empty string if applicationWallet not exist', () => {
    expect(() => walletPresenter.getName()).throws('Application wallet not found');
  });

  it('return contract address if applicationWallet exist', () => {
    walletService.connect(applicationWallet);
    expect(walletPresenter.getContractAddress()).to.be.eq(applicationWallet.contractAddress);
  });

  it('return empty string if applicationWallet not exist', () => {
    expect(() => walletPresenter.getContractAddress()).throws('Application wallet not found');
  });
});
