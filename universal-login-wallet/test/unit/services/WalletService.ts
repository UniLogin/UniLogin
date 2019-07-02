import {expect} from 'chai';
import UniversalLoginSDK, {FutureWallet} from '@universal-login/sdk';
import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import WalletService from '../../../src/services/WalletService';
import UserWallet from '../../../src/core/entities/UserWallet';

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
    walletService.connect(userWallet);
    expect(walletService.userWallet).to.deep.eq(userWallet);
    expect(walletService.state).to.be.eq('Deployed');
  });

  it('roundtrip', () => {
    expect(walletService.state).to.be.eq('None', 'Initial WalletService state does not equal None');
    expect(walletService.userWallet).to.be.undefined;
    walletService.setFutureWallet(futureWallet);
    expect(walletService.userWallet).to.deep.eq(futureWallet);
    expect(walletService.state).to.be.eq('Future');
    walletService.setDeployed(userWallet.name);
    expect(walletService.userWallet).to.deep.eq({
      contractAddress: futureWallet.contractAddress,
      privateKey: futureWallet.privateKey,
      name: userWallet.name
    });
    expect(walletService.state).to.be.eq('Deployed');
    walletService.disconnect();
    expect(walletService.userWallet).to.be.undefined;
    expect(walletService.state).to.be.eq('None');
    walletService.connect(userWallet);
    expect(walletService.userWallet).to.deep.eq(userWallet);
    expect(walletService.state).to.be.eq('Deployed');
  });

  it('should throw if future wallet is not set', () => {
    expect(() => walletService.setDeployed(userWallet.name)).to.throw('Future wallet was not set');
  });

  it('should throw if wallet is overriden', () => {
    walletService.connect(userWallet);
    expect(() => walletService.setFutureWallet(futureWallet)).to.throw('Wallet cannot be overrided');
  });
});
