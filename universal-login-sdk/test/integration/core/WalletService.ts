import chai, {expect} from 'chai';
import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY, walletFromBrain} from '@universal-login/commons';
import UniversalLoginSDK from '../../../lib/api/sdk';
import {FutureWallet} from '../../../lib/api/FutureWalletFactory';
import {WalletService} from '../../../lib/core/services/WalletService';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {DeployedWallet} from '../../../lib';

chai.use(sinonChai);

describe('INT: WalletService', () => {
  const sdk = {} as UniversalLoginSDK;
  const deployedWallet: DeployedWallet = new DeployedWallet('0x123', 'justyna.nylogin.eth', '0x5422', sdk);
  const applicationWallet = deployedWallet.asApplicationWallet;
  const futureWallet: FutureWallet = {
    contractAddress: TEST_ACCOUNT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    deploy: async () => new DeployedWallet(TEST_ACCOUNT_ADDRESS, '', TEST_PRIVATE_KEY, null as any),
    waitForBalance: (async () => { }) as any
  };
  const storage = {load: () => applicationWallet, save: sinon.fake(), remove: sinon.fake()};
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService(sdk, walletFromBrain, storage);
    storage.save.resetHistory();
  });

  it('disconnect resets state to None', () => {
    walletService.connect(applicationWallet)
    walletService.disconnect();
    expect(walletService.state).to.deep.eq({kind: 'None'});
    expect(storage.remove).to.be.called;
  });

  it('connect set state to Deployed', () => {
    walletService.connect(applicationWallet);
    expect(walletService.state).to.deep.eq({kind: 'Deployed', wallet: deployedWallet});
  });

  it('should save applicationWallet to localstorage', () => {
    walletService.saveToStorage(applicationWallet);
    expect(storage.save).to.be.calledWith(applicationWallet);
  });

  it('roundtrip', () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setFutureWallet(futureWallet);
    expect(walletService.state).to.deep.eq({kind: 'Future', wallet: futureWallet});

    walletService.setDeployed(applicationWallet.name);
    const expectedWallet = new DeployedWallet(
      futureWallet.contractAddress,
      applicationWallet.name,
      futureWallet.privateKey,
      sdk,
    );
    expect(walletService.state).to.deep.eq({kind: 'Deployed', wallet: expectedWallet});
    expect(storage.save.args[0]).to.deep.eq([expectedWallet.asApplicationWallet]);

    walletService.disconnect();
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.connect(applicationWallet);
    expect(walletService.state).to.deep.eq({kind: 'Deployed', wallet: deployedWallet});

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
    expect(walletService.state).to.deep.eq({kind: 'Deployed', wallet: deployedWallet});
  });
});
