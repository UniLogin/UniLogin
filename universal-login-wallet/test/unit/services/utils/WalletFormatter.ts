import {expect} from 'chai';
import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import WalletService from '../../../../src/services/WalletService';
import WalletFormatter from '../../../../src/services/utils/WalletFormatter';

describe('WalletFormatter', async () => {
  const walletService = new WalletService();
  const walletFormatter = new WalletFormatter(walletService);
  const userWallet = {
    name: 'name.mylogin.eth',
    contractAddress: TEST_ACCOUNT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY
  };

  it('return name if userWallet exist', () => {
    walletService.userWallet = userWallet;
    expect(walletFormatter.getName()).to.be.eq(userWallet.name);
  });

  it('return empty string if userWallet not exist', () => {
    walletService.userWallet = null;
    expect(() => walletFormatter.getName()).throws('UserWallet not found');
  });
});
