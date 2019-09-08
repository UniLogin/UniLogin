import chai, {expect} from 'chai';
import {ApplicationWallet, TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY, walletFromBrain} from '@universal-login/commons';
import UniversalLoginSDK from '../../../lib/api/sdk';
import {FutureWallet} from '../../../lib/api/FutureWalletFactory';
import {WalletService} from '../../../lib/core/services/WalletService';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {DeployedWallet} from '../../../lib';

chai.use(sinonChai);

describe('INT: WalletService', () => {
  const applicationWallet: ApplicationWallet = { name: 'justyna.nylogin.eth', contractAddress: '0x123', privateKey: '0x5422' };
  const futureWallet: FutureWallet = {
    contractAddress: TEST_ACCOUNT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    deploy: async () => new DeployedWallet(TEST_ACCOUNT_ADDRESS, '', TEST_PRIVATE_KEY, null as any),
    waitForBalance: (async () => { }) as any
  };
  const storage = {load: () => applicationWallet, save: sinon.fake(), remove: sinon.fake()};
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService({} as UniversalLoginSDK, walletFromBrain, storage);
    storage.save.resetHistory();
  });

  it('should disconnect', () => {
    walletService.applicationWallet = applicationWallet;
    expect(walletService.applicationWallet).to.deep.eq(applicationWallet);
    walletService.disconnect();
    expect(walletService.applicationWallet).to.be.undefined;
    expect(walletService.state).to.be.eq('None');
    expect(storage.remove).to.be.called;
  });

  it('should set state and applicationWallet', () => {
    walletService.connect(applicationWallet);
    expect(walletService.applicationWallet).to.deep.eq(applicationWallet);
    expect(walletService.state).to.be.eq('Deployed');
  });

  it('should save applicationWallet to localstorage', () => {
    walletService.saveToStorage(applicationWallet);
    expect(storage.save).to.be.calledWith(applicationWallet);
  });

  it('roundtrip', () => {
    expect(walletService.state).to.be.eq('None', 'Initial WalletService state does not equal None');
    expect(walletService.applicationWallet).to.be.undefined;

    walletService.setFutureWallet(futureWallet);
    expect(walletService.applicationWallet).to.deep.eq(futureWallet);
    expect(walletService.state).to.be.eq('Future');

    walletService.setDeployed(applicationWallet.name);
    const expectedWallet = {
      contractAddress: futureWallet.contractAddress,
      privateKey: futureWallet.privateKey,
      name: applicationWallet.name
    };
    expect(walletService.applicationWallet).to.deep.eq(expectedWallet);
    expect(walletService.state).to.be.eq('Deployed');
    expect(storage.save.args[0]).to.deep.eq([expectedWallet]);

    walletService.disconnect();
    expect(walletService.applicationWallet).to.be.undefined;
    expect(walletService.state).to.be.eq('None');

    walletService.connect(applicationWallet);
    expect(walletService.applicationWallet).to.deep.eq(applicationWallet);
    expect(walletService.state).to.be.eq('Deployed');

    walletService.saveToStorage(applicationWallet);
    expect(storage.save).to.be.calledWith(applicationWallet);
  });

  it('should throw if future wallet is not set', () => {
    expect(() => walletService.setDeployed(applicationWallet.name)).to.throw('Future wallet was not set');
  });

  it('should throw if wallet is overridden', () => {
    walletService.connect(applicationWallet);
    expect(() => walletService.setFutureWallet(futureWallet)).to.throw('Wallet cannot be overridded');
  });

  it('should load from storage', () => {
    walletService.loadFromStorage();
    expect(walletService.state).to.eq('Deployed');
    expect(walletService.applicationWallet).to.deep.eq(applicationWallet);
  });
});
