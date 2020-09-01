import {createKeyPair, TEST_EXECUTION_OPTIONS, KeyPair, ProviderService} from '@unilogin/commons';
import {RelayerUnderTest} from '@unilogin/relayer';
import chai, {expect} from 'chai';
import {MockProvider, solidity} from 'ethereum-waffle';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import UniLoginSdk, {DeployedWallet, WalletEventFilter} from '../../../src';
import WalletEventsObserverFactory from '../../../src/core/observers/WalletEventsObserverFactory';
import {createdDeployedWallet} from '../../helpers/createDeployedWallet';
import {setupSdk} from '../../helpers/setupSdk';
import {BlockNumberState} from '../../../src/core/states/BlockNumberState';
import {setupWalletContract} from '@unilogin/contracts/testutils';
import {Contract} from 'ethers';
import {waitExpect, mineBlock} from '@unilogin/commons/testutils';

chai.use(solidity);
chai.use(sinonChai);

describe('INT: WalletEventsObserverFactory', () => {
  const provider = new MockProvider();
  const [deployer] = provider.getWallets();
  const {publicKey} = createKeyPair();
  let relayer: RelayerUnderTest;
  let sdk: UniLoginSdk;
  let deployedWallet: DeployedWallet;
  let filter: WalletEventFilter;
  let factory: WalletEventsObserverFactory;
  let proxyWallet: Contract;
  let keyPair: KeyPair;

  describe('beta2', () => {
    before(async () => {
      ({relayer, sdk} = await setupSdk(deployer));

      const providerService = new ProviderService(sdk.provider);
      const blockNumberState = new BlockNumberState(providerService);
      factory = new WalletEventsObserverFactory(
        providerService,
        blockNumberState,
      );
      await factory.start();
      ({proxyWallet, keyPair} = await setupWalletContract(deployer));
      deployedWallet = new DeployedWallet(proxyWallet.address, '', keyPair.privateKey, sdk, '');
      filter = {
        contractAddress: deployedWallet.contractAddress,
        key: publicKey,
      };
    });

    it('subscribe to KeyAdded', async () => {
      const callback = sinon.spy();
      const unsubscribe = factory.subscribe('KeyAdded', filter, callback);
      await deployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS);
      await waitExpect(() => expect(callback).to.have.been.calledOnce);
      expect(callback).to.have.been.calledOnceWith({key: publicKey});
      unsubscribe();
    });

    it('subscribe to KeyRemoved', async () => {
      const callbackRemove = sinon.spy();
      const unsubscribe = factory.subscribe('KeyRemoved', filter, callbackRemove);
      const execution = await deployedWallet.removeKey(publicKey, TEST_EXECUTION_OPTIONS);
      await execution.waitToBeSuccess();
      await waitExpect(() => expect(callbackRemove).to.have.been.calledOnce);
      expect(callbackRemove).to.have.been.calledWith({key: publicKey});
      unsubscribe();
    });

    it('callback is called after factory is restarted', async () => {
      const callback = sinon.spy();
      let unsubscribe = factory.subscribe('KeyAdded', filter, callback);
      const execution = await deployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS);
      factory.stop();
      unsubscribe();
      await execution.waitToBeSuccess();
      await mineBlock(deployer);
      await factory.start();
      unsubscribe = factory.subscribe('KeyAdded', filter, callback);
      await mineBlock(deployer);
      await waitExpect(() => expect(callback).to.have.been.calledOnce);
      expect(callback).to.have.been.calledOnceWith({key: publicKey});
      unsubscribe();
    });

    after(async () => {
      await relayer.stop();
      factory.stop();
    });
  });

  describe('beta3', () => {
    before(async () => {
      ({relayer, sdk} = await setupSdk(deployer));
      const providerService = new ProviderService(sdk.provider);
      const blockNumberState = new BlockNumberState(providerService);
      factory = new WalletEventsObserverFactory(
        providerService,
        blockNumberState,
      );
      await factory.start();
      deployedWallet = await createdDeployedWallet('alex.mylogin.eth', sdk, deployer);
      filter = {
        contractAddress: deployedWallet.contractAddress,
        key: publicKey,
      };
    });

    it('subscribe to KeyAdded', async () => {
      const callbackGnosis = sinon.spy();
      const unsubscribe = factory.subscribe('AddedOwner', filter, callbackGnosis);
      const {waitToBeSuccess} = await deployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS);
      await waitToBeSuccess();
      await waitExpect(() => expect(callbackGnosis).to.have.been.calledOnce);
      expect(callbackGnosis).to.have.been.calledWith({key: publicKey});
      unsubscribe();
    });

    it('subscribe to RemovedOwner', async () => {
      const callbackRemoveGnosis = sinon.spy();
      const unsubscribe = factory.subscribe('RemovedOwner', filter, callbackRemoveGnosis);
      const execution = await deployedWallet.removeKey(publicKey, TEST_EXECUTION_OPTIONS);
      await execution.waitToBeSuccess();
      await waitExpect(() => expect(callbackRemoveGnosis).to.have.been.calledOnce);
      expect(callbackRemoveGnosis).to.have.been.calledWith({key: publicKey});
      unsubscribe();
    });

    it('callback is called after factory is restarted', async () => {
      const callback = sinon.spy();
      let unsubscribe = factory.subscribe('AddedOwner', filter, callback);
      const execution = await deployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS);
      factory.stop();
      unsubscribe();
      await execution.waitToBeSuccess();
      await mineBlock(deployer);
      await factory.start();
      unsubscribe = factory.subscribe('AddedOwner', filter, callback);
      await mineBlock(deployer);
      await waitExpect(() => expect(callback).to.have.been.calledOnce);
      expect(callback).to.have.been.calledOnceWith({key: publicKey});
      unsubscribe();
    });

    after(async () => {
      await relayer.stop();
      factory.stop();
    });
  });
});
