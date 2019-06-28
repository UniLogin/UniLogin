import {expect} from 'chai';
import UniversalLoginSDK, {FutureWallet} from '@universal-login/sdk';
import WalletService, {UserWallet} from '../../../src/services/WalletService';
import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';

describe('WalletService', () => {
  const userWallet: UserWallet = { name: 'justyna.nylogin.eth', contractAddress: '0x123', privateKey: '0x5422' };
  const futureWallet: FutureWallet = {
    contractAddress: TEST_ACCOUNT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    deploy: async () => { },
    waitForBalance: (async () => { }) as any
  };
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService({} as UniversalLoginSDK);
  });

  it('should disconnect', () => {
    walletService.userWallet = userWallet;
    expect(walletService.userWallet).to.deep.eq(userWallet);
    walletService.disconnect();
    expect(walletService.userWallet).to.be.undefined;
    expect(walletService.state).to.be.eq('None');
  });

  it('should set state and userWallet', () => {
    walletService.setUserWallet(userWallet);
    expect(walletService.userWallet).to.deep.eq(userWallet);
    expect(walletService.state).to.be.eq('Deployed');
  });

  it('roundtrip', () => {
    expect(walletService.state).to.be.eq('None', 'Initial WalletService state does not equal None');
    expect(walletService.userWallet).to.be.undefined;
    walletService.setFutureWallet(futureWallet);
    expect(walletService.userWallet).to.deep.eq(futureWallet);
    expect(walletService.state).to.be.eq('Future');
    walletService.setUserWallet(userWallet);
    expect(walletService.userWallet).to.deep.eq(userWallet);
    expect(walletService.state).to.be.eq('Deployed');
    walletService.disconnect();
    expect(walletService.userWallet).to.be.undefined;
    expect(walletService.state).to.be.eq('None');
  });
});
