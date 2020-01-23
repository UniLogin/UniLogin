import {createKeyPair, TEST_EXECUTION_OPTIONS, KeyPair} from '@universal-login/commons';
import {BlockchainService} from '@universal-login/contracts';
import {RelayerUnderTest} from '@universal-login/relayer';
import chai, {expect} from 'chai';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import UniversalLoginSDK, {DeployedWallet, WalletEventFilter} from '../../../src';
import WalletEventsObserverFactory from '../../../src/core/observers/WalletEventsObserverFactory';
import {createdDeployedWallet} from '../../helpers/createDeployedWallet';
import {setupSdk} from '../../helpers/setupSdk';
import {BlockNumberState} from '../../../src/core/states/BlockNumberState';
import {setupWalletContract} from '@universal-login/contracts/testutils';
import {Contract} from 'ethers';
import {waitExpect} from '@universal-login/commons/testutils';

chai.use(solidity);
chai.use(sinonChai);

describe('INT: WalletEventsObserverFactory', async () => {
  const provider = createMockProvider();
  const [deployer] = getWallets(provider);
  const {publicKey} = createKeyPair();
  let relayer: RelayerUnderTest;
  let sdk: UniversalLoginSDK;
  let deployedWallet: DeployedWallet;
  let filter: WalletEventFilter;
  let factory: WalletEventsObserverFactory;
  let proxyWallet: Contract;
  let keyPair: KeyPair;

  describe('beta2', () => {
    before(async () => {
      ({relayer, sdk} = await setupSdk(deployer));
      const blockchainService = new BlockchainService(sdk.provider);
      factory = new WalletEventsObserverFactory(
        blockchainService,
        new BlockProperty(blockchainService),
      );
      await factory.start();
      ({proxyWallet, keyPair} = await setupWalletContract(deployer));
      deployedWallet = (sdk as any).createDeployedWallet(proxyWallet.address, keyPair.privateKey);
      filter = {
        contractAddress: deployedWallet.contractAddress,
        key: publicKey,
      };
    });

    it('subscribe to KeyAdded', async () => {
      const callback = sinon.spy();
      await factory.subscribe('KeyAdded', filter, callback);
      await deployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS);
      await waitExpect(() => expect(callback).to.have.been.calledOnce);
      expect(callback).to.have.been.calledWith({key: publicKey});
    });

    it('subscribe to KeyRemoved', async () => {
      const callbackRemove = sinon.spy();
      await factory.subscribe('KeyRemoved', filter, callbackRemove);
      const execution = await deployedWallet.removeKey(publicKey, TEST_EXECUTION_OPTIONS);
      await execution.waitToBeSuccess();
      await waitExpect(() => expect(callbackRemove).to.have.been.calledOnce);
      expect(callbackRemove).to.have.been.calledWith({key: publicKey});
    });

    after(async () => {
      await relayer.clearDatabase();
      await relayer.stop();
      factory.stop();
    });
  });

  describe('beta3', () => {
    before(async () => {
      ({relayer, sdk} = await setupSdk(deployer));
      const blockchainService = new BlockchainService(sdk.provider);
      factory = new WalletEventsObserverFactory(
        blockchainService,
        new BlockProperty(blockchainService),
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
      await factory.subscribe('AddedOwner', filter, callbackGnosis);
      const {waitToBeSuccess} = await deployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS);
      await waitToBeSuccess();
      await waitExpect(() => expect(callbackGnosis).to.have.been.calledOnce);
      expect(callbackGnosis).to.have.been.calledWith({key: publicKey});
    });

    it('subscribe to RemovedOwner', async () => {
      const callbackRemoveGnosis = sinon.spy();
      await factory.subscribe('RemovedOwner', filter, callbackRemoveGnosis);
      const execution = await deployedWallet.removeKey(publicKey, TEST_EXECUTION_OPTIONS);
      await execution.waitToBeSuccess();
      await waitExpect(() => expect(callbackRemoveGnosis).to.have.been.calledOnce);
      expect(callbackRemoveGnosis).to.have.been.calledWith({key: publicKey});
    });

    after(async () => {
      await relayer.clearDatabase();
      await relayer.stop();
      factory.stop();
    });
  });
});
