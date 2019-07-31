import {expect} from 'chai';
import {ApplicationWallet, TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import UniversalLoginSDK from '../../../lib/api/sdk';
import {FutureWallet} from '../../../lib/api/FutureWalletFactory';
import {WalletService} from '../../../lib/core/services/WalletService';

describe('WalletService', () => {
  const applicationWallet: ApplicationWallet = { name: 'justyna.nylogin.eth', contractAddress: '0x123', privateKey: '0x5422' };
  const futureWallet: FutureWallet = {
    contractAddress: TEST_ACCOUNT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    deploy: async () => '',
    waitForBalance: (async () => { }) as any
  };
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService({} as UniversalLoginSDK);
  });

  it('should disconnect', () => {
    walletService.applicationWallet = applicationWallet;
    expect(walletService.applicationWallet).to.deep.eq(applicationWallet);
    walletService.disconnect();
    expect(walletService.applicationWallet).to.be.undefined;
    expect(walletService.state).to.be.eq('None');
  });

  it('should set state and applicationWallet', () => {
    walletService.connect(applicationWallet);
    expect(walletService.applicationWallet).to.deep.eq(applicationWallet);
    expect(walletService.state).to.be.eq('Deployed');
  });

  it('roundtrip', () => {
    expect(walletService.state).to.be.eq('None', 'Initial WalletService state does not equal None');
    expect(walletService.applicationWallet).to.be.undefined;
    walletService.setFutureWallet(futureWallet);
    expect(walletService.applicationWallet).to.deep.eq(futureWallet);
    expect(walletService.state).to.be.eq('Future');
    walletService.setDeployed(applicationWallet.name);
    expect(walletService.applicationWallet).to.deep.eq({
      contractAddress: futureWallet.contractAddress,
      privateKey: futureWallet.privateKey,
      name: applicationWallet.name
    });
    expect(walletService.state).to.be.eq('Deployed');
    walletService.disconnect();
    expect(walletService.applicationWallet).to.be.undefined;
    expect(walletService.state).to.be.eq('None');
    walletService.connect(applicationWallet);
    expect(walletService.applicationWallet).to.deep.eq(applicationWallet);
    expect(walletService.state).to.be.eq('Deployed');
  });

  it('should throw if future wallet is not set', () => {
    expect(() => walletService.setDeployed(applicationWallet.name)).to.throw('Future wallet was not set');
  });

  it('should throw if wallet is overridden', () => {
    walletService.connect(applicationWallet);
    expect(() => walletService.setFutureWallet(futureWallet)).to.throw('Wallet cannot be overridded');
  });
});
