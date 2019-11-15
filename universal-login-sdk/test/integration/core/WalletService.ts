import chai, {expect} from 'chai';
import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY, walletFromBrain, ApplicationWallet} from '@universal-login/commons';
import {FutureWallet} from '../../../lib/api/FutureWalletFactory';
import {WalletService} from '../../../lib/core/services/WalletService';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {DeployedWallet, SerializedWalletState} from '../../../lib';
import {Wallet} from 'ethers';

chai.use(sinonChai);

describe('INT: WalletService', () => {
  let walletService: WalletService;
  let applicationWallet: ApplicationWallet;
  let storage: any;
  let deployedWallet: DeployedWallet;
  let futureWallet: FutureWallet;
  let sdk: any;

  before(() => {
    sdk = {provider: Wallet.createRandom()} as any;
    deployedWallet = new DeployedWallet(TEST_ACCOUNT_ADDRESS, 'justyna.nylogin.eth', '0x29F3EDEE0AD3ABF8E2699402E0E28CD6492C9BE7EAAB00D732A791C33552F779', sdk);
    applicationWallet = deployedWallet.asApplicationWallet;
    futureWallet = {
      contractAddress: TEST_ACCOUNT_ADDRESS,
      privateKey: TEST_PRIVATE_KEY,
      deploy: async () => ({
        waitForTransactionHash: sinon.stub(),
        waitToBeSuccess: async () => new DeployedWallet(TEST_ACCOUNT_ADDRESS, 'justyna.nylogin.eth', TEST_PRIVATE_KEY, sdk),
      }),
      waitForBalance: (async () => { }) as any,
    };
    storage = {
      load: (): SerializedWalletState => ({kind: 'Deployed', wallet: applicationWallet}),
      save: sinon.fake(),
      remove: sinon.fake(),
    };
  });

  beforeEach(() => {
    walletService = new WalletService(sdk, walletFromBrain, storage);
    storage.save.resetHistory();
  });

  it('disconnect resets state to None', () => {
    walletService.setWallet(applicationWallet);
    walletService.disconnect();
    expect(walletService.state).to.deep.eq({kind: 'None'});
    expect(storage.save).to.be.calledWith({kind: 'None'});
  });

  it('connect set state to Deployed', () => {
    walletService.setWallet(applicationWallet);
    expect(walletService.state.kind).to.eq('Deployed');
    expect((walletService.state as any).wallet).to.deep.include(applicationWallet);
    expect(storage.save).to.be.calledWith({kind: 'Deployed', wallet: applicationWallet});
  });

  it('roundtrip', () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setFutureWallet(futureWallet,  'name.mylogin.eth');
    expect(walletService.state).to.deep.eq({kind: 'Future', name: 'name.mylogin.eth', wallet: futureWallet});
    expect(storage.save).to.be.calledWith({
      kind: 'Future',
      name: 'name.mylogin.eth',
      wallet: {contractAddress: futureWallet.contractAddress, privateKey: futureWallet.privateKey},
    });

    walletService.setDeployed(applicationWallet.name);
    expect(walletService.state.kind).to.eq('Deployed');
    expect((walletService.state as any).wallet).to.deep.include({
      contractAddress: futureWallet.contractAddress,
      name: applicationWallet.name,
      privateKey: futureWallet.privateKey,
    });

    walletService.disconnect();
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setWallet(applicationWallet);
    expect(walletService.state.kind).to.eq('Deployed');
    expect((walletService.state as any).wallet).to.deep.include(applicationWallet);

    expect(storage.save).to.be.calledWith({kind: 'Deployed', wallet: applicationWallet});
  });

  it('should throw if future wallet is not set', () => {
    expect(() => walletService.setDeployed(applicationWallet.name)).to.throw('Future wallet was not set');
  });

  it('should throw if wallet is overridden', () => {
    walletService.setWallet(applicationWallet);
    expect(() => walletService.setFutureWallet(futureWallet, 'name.mylogin.eth')).to.throw('Wallet cannot be overridded');
  });

  it('should load from storage', async () => {
    await walletService.loadFromStorage();
    expect(walletService.state.kind).to.eq('Deployed');
    expect((walletService.state as any).wallet).to.deep.include(applicationWallet);
  });
});
