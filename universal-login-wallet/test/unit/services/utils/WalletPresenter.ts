import {expect} from 'chai';
import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import WalletService from '../../../../src/integration/storage/WalletService';
import WalletPresenter from '../../../../src/core/presenters/WalletPresenter';

describe('WalletFormatter', async () => {
  let walletService: WalletService;
  let walletPresenter: WalletPresenter;
  const userWallet = {
    name: 'name.mylogin.eth',
    contractAddress: TEST_ACCOUNT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY
  };

  beforeEach(() => {
    walletService = new WalletService({} as UniversalLoginSDK);
    walletPresenter = new WalletPresenter(walletService);
  });

  it('return name if userWallet exist', () => {
    walletService.connect(userWallet);
    expect(walletPresenter.getName()).to.be.eq(userWallet.name);
  });

  it('return empty string if userWallet not exist', () => {
    expect(() => walletPresenter.getName()).throws('UserWallet not found');
  });

  it('return contract address if userWallet exist', () => {
    walletService.userWallet = userWallet;
    expect(walletPresenter.getContractAddress()).to.be.eq(userWallet.contractAddress);
  });

  it('return empty string if userWallet not exist', () => {
    expect(() => walletPresenter.getContractAddress()).throws('UserWallet not found');
  });
});
