import chai, {expect} from 'chai';
import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY, walletFromBrain} from '@universal-login/commons';
import UniversalLoginSDK from '../../../lib/api/sdk';
import {FutureWallet} from '../../../lib/api/FutureWalletFactory';
import {WalletService} from '../../../lib/core/services/WalletService';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {DeployedWallet} from '../../../lib';
import basicSDK from '../../fixtures/basicSDK';
import {loadFixture} from 'ethereum-waffle';

chai.use(sinonChai);

describe('INT: WalletService', () => {
  let sdk: UniversalLoginSDK;
  let deployedWallet: DeployedWallet;

  const futureWallet: FutureWallet = {
    contractAddress: TEST_ACCOUNT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    deploy: async () => ({
      waitForTransactionHash: sinon.stub(),
      waitToBeSuccess: async () => new DeployedWallet(TEST_ACCOUNT_ADDRESS, '', TEST_PRIVATE_KEY, null as any),
    }),
    waitForBalance: (async () => { }) as any,
  };
  const storage = {load: () => deployedWallet.asApplicationWallet, save: sinon.fake(), remove: sinon.fake()};
  let walletService: WalletService;

  beforeEach(async () => {
    ({sdk, deployedWallet} = await loadFixture(basicSDK));

    walletService = new WalletService(sdk, walletFromBrain, storage);
    storage.save.resetHistory();
  });

  it('disconnect resets state to None', () => {
    walletService.setWallet(deployedWallet.asApplicationWallet);
    walletService.disconnect();
    expect(walletService.state).to.deep.eq({kind: 'None'});
    expect(storage.remove).to.be.called;
  });

  it('connect set state to Deployed', () => {
    walletService.setWallet(deployedWallet.asApplicationWallet);
    expect(walletService.state).to.deep.eq({kind: 'Deployed', wallet: deployedWallet});
  });

  it('should save deployedWallet.asApplicationWallet to localstorage', () => {
    walletService.saveToStorage(deployedWallet.asApplicationWallet);
    expect(storage.save).to.be.calledWith(deployedWallet.asApplicationWallet);
  });

  it('roundtrip', () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setFutureWallet(futureWallet);
    expect(walletService.state).to.deep.eq({kind: 'Future', wallet: futureWallet});

    walletService.setDeployed(deployedWallet.asApplicationWallet.name);
    const expectedWallet = new DeployedWallet(
      futureWallet.contractAddress,
      deployedWallet.asApplicationWallet.name,
      futureWallet.privateKey,
      sdk,
    );
    expect(walletService.state).to.deep.eq({kind: 'Deployed', wallet: expectedWallet});
    expect(storage.save.args[0]).to.deep.eq([expectedWallet.asApplicationWallet]);

    walletService.disconnect();
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setWallet(deployedWallet.asApplicationWallet);
    expect(walletService.state).to.deep.eq({kind: 'Deployed', wallet: deployedWallet});

    walletService.saveToStorage(deployedWallet.asApplicationWallet);
    expect(storage.save).to.be.calledWith(deployedWallet.asApplicationWallet);
  });

  it('should throw if future wallet is not set', () => {
    expect(() => walletService.setDeployed(deployedWallet.asApplicationWallet.name)).to.throw('Future wallet was not set');
  });

  it('should throw if wallet is overridden', () => {
    walletService.setWallet(deployedWallet.asApplicationWallet);
    expect(() => walletService.setFutureWallet(futureWallet)).to.throw('Wallet cannot be overridded');
  });

  it('should load from storage', () => {
    walletService.loadFromStorage();
    expect(walletService.state).to.deep.eq({kind: 'Deployed', wallet: deployedWallet});
  });
});
