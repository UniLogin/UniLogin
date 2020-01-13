import {createKeyPair, TEST_EXECUTION_OPTIONS, waitUntil} from '@universal-login/commons';
import {BlockchainService} from '@universal-login/contracts';
import {RelayerUnderTest} from '@universal-login/relayer';
import chai, {expect} from 'chai';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import UniversalLoginSDK, {DeployedWallet} from '../../../src';
import WalletEventsObserverFactory from '../../../src/core/observers/WalletEventsObserverFactory';
import {createdDeployedWallet} from '../../helpers/createDeployedWallet';
import {setupSdk} from '../../helpers/setupSdk';
import {BlockProperty} from '../../../src/core/properties/BlockProperty';

chai.use(solidity);
chai.use(sinonChai);

describe('INT: WalletEventsObserverFactory', async () => {
  const provider = createMockProvider();
  const [deployer] = getWallets(provider);
  const {publicKey} = createKeyPair();
  const callback = sinon.spy();
  let relayer: RelayerUnderTest;
  let sdk: UniversalLoginSDK;
  let deployedWallet: DeployedWallet;
  let filter: any;
  let factory: WalletEventsObserverFactory;

  before(async () => {
    ({relayer, sdk} = await setupSdk(deployer));
    factory = new WalletEventsObserverFactory(new BlockchainService(sdk.provider), new BlockProperty(provider));
    deployedWallet = await createdDeployedWallet('alex.mylogin.eth', sdk, deployer);
    filter = {
      contractAddress: deployedWallet.contractAddress,
      key: publicKey,
    };
    await factory.start();
  });

  it('subscribe to KeyAdded', async () => {
    await factory.subscribe('KeyAdded', filter, callback);
    const execution = await deployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS);
    await execution.waitToBeSuccess();
    await factory.fetchEvents();
    await waitUntil(() => !!callback.firstCall);
    expect(callback).to.have.been.calledWith({key: publicKey});
  });

  it('subscribe to KeyRemoved', async () => {
    await factory.subscribe('KeyRemoved', filter, callback);
    const execution = await deployedWallet.removeKey(publicKey, TEST_EXECUTION_OPTIONS);
    await execution.waitToBeSuccess();
    await factory.fetchEvents();
    await waitUntil(() => !!callback.firstCall);
    expect(callback).to.have.been.calledWith({key: publicKey});
  });

  after(async () => {
    await relayer.clearDatabase();
    await relayer.stop();
    await factory.finalizeAndStop();
  });
});
