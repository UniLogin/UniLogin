import chai, {expect} from 'chai';
import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY, walletFromBrain, ApplicationWallet, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
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
    deployedWallet = new DeployedWallet(TEST_ACCOUNT_ADDRESS, 'justyna.mylogin.eth', TEST_PRIVATE_KEY, sdk);
    applicationWallet = deployedWallet.asApplicationWallet;
    futureWallet = {
      contractAddress: TEST_ACCOUNT_ADDRESS,
      privateKey: TEST_PRIVATE_KEY,
      deploy: async () => ({
        waitForTransactionHash: sinon.stub().returns({transactionHash: '0x123'}),
        waitToBeSuccess: async () => new DeployedWallet(TEST_ACCOUNT_ADDRESS, 'justyna.mylogin.eth', TEST_PRIVATE_KEY, sdk),
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

    walletService.setFutureWallet(futureWallet,  'justyna.mylogin.eth');
    expect(walletService.state).to.deep.eq({kind: 'Future', name: 'justyna.mylogin.eth', wallet: futureWallet});
    expect(storage.save).to.be.calledWith({
      kind: 'Future',
      name: 'justyna.mylogin.eth',
      wallet: {contractAddress: futureWallet.contractAddress, privateKey: futureWallet.privateKey},
    });

    walletService.setDeployed();
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
    expect(() => walletService.setDeployed()).to.throw('Future wallet was not set');
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

  it('deployFutureWallet returns deployedWallet', async () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setFutureWallet(futureWallet,  'justyna.mylogin.eth');
    expect(walletService.state).to.deep.eq({kind: 'Future', name: 'justyna.mylogin.eth', wallet: futureWallet});
    expect(await walletService.deployFutureWallet('1', ETHER_NATIVE_TOKEN.address)).to.deep.include(applicationWallet);
  });
});
