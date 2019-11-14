import chai, {expect} from 'chai';
import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY, walletFromBrain} from '@universal-login/commons';
import UniversalLoginSDK from '../../../lib/api/sdk';
import {FutureWallet} from '../../../lib/api/FutureWalletFactory';
import {WalletService} from '../../../lib/core/services/WalletService';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {DeployedWallet, SerializedWalletState} from '../../../lib';

chai.use(sinonChai);

describe('INT: WalletService', () => {
  const sdk = {} as UniversalLoginSDK;
  const deployedWallet: DeployedWallet = new DeployedWallet('0x123', 'justyna.nylogin.eth', '0x29F3EDEE0AD3ABF8E2699402E0E28CD6492C9BE7EAAB00D732A791C33552F779', sdk);
  const applicationWallet = deployedWallet.asApplicationWallet;
  const futureWallet: FutureWallet = {
    contractAddress: TEST_ACCOUNT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    deploy: async () => ({
      waitForTransactionHash: sinon.stub(),
      waitToBeSuccess: async () => new DeployedWallet(TEST_ACCOUNT_ADDRESS, '', TEST_PRIVATE_KEY, sdk),
    }),
    waitForBalance: (async () => { }) as any,
  };
  const storage = {
    load: (): SerializedWalletState => ({kind: 'Deployed', wallet: applicationWallet}),
    save: sinon.fake(),
    remove: sinon.fake(),
  };
  let walletService: WalletService;

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
    expect(walletService.state).to.deep.eq({kind: 'Deployed', wallet: deployedWallet});
    expect(storage.save).to.be.calledWith({kind: 'Deployed', wallet: applicationWallet});
  });

  it('roundtrip', () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setFutureWallet(futureWallet);
    expect(walletService.state).to.deep.eq({kind: 'Future', wallet: futureWallet});
    expect(storage.save).to.be.calledWith({
      kind: 'Future',
      wallet: {contractAddress: futureWallet.contractAddress, privateKey: futureWallet.privateKey},
    });

    walletService.setDeployed(applicationWallet.name);
    const expectedWallet = new DeployedWallet(
      futureWallet.contractAddress,
      applicationWallet.name,
      futureWallet.privateKey,
      sdk,
    );
    expect(walletService.state).to.deep.eq({kind: 'Deployed', wallet: expectedWallet});
    expect(storage.save).to.be.calledWith({kind: 'Deployed', wallet: expectedWallet.asApplicationWallet});

    walletService.disconnect();
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setWallet(applicationWallet);
    expect(walletService.state).to.deep.eq({kind: 'Deployed', wallet: deployedWallet});

    expect(storage.save).to.be.calledWith({kind: 'Deployed', wallet: applicationWallet});
  });

  it('should throw if future wallet is not set', () => {
    expect(() => walletService.setDeployed(applicationWallet.name)).to.throw('Future wallet was not set');
  });

  it('should throw if wallet is overridden', () => {
    walletService.setWallet(applicationWallet);
    expect(() => walletService.setFutureWallet(futureWallet)).to.throw('Wallet cannot be overridded');
  });

  it('should load from storage', async () => {
    await walletService.loadFromStorage();
    expect(walletService.state).to.deep.eq({kind: 'Deployed', wallet: deployedWallet});
  });
});
