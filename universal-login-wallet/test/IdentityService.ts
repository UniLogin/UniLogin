import {expect} from 'chai';
import UserWalletService from '../src/services/UserWalletService';

describe('UserWalletService', () => {
  it('set identity works', () => {
    const userWalletService = new UserWalletService();
    const newUserWallet = {
      name: 'new-identity.login.eth',
      address: '0x1234556',
      privateKey: '0x98765',
    };
    userWalletService.userWallet = newUserWallet;
    expect(userWalletService.userWallet).to.deep.eq(newUserWallet);
  });
});
