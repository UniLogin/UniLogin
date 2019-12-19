import chai, {expect} from 'chai';
import {getWallets, createMockProvider, solidity} from 'ethereum-waffle';
import Relayer from '@universal-login/relayer';
import {setupSdk} from '../../helpers/setupSdk';
import UniversalLoginSDK from '../../../src/api/sdk';
import {WalletService} from '../../../src/core/services/WalletService';
import {Wallet, utils} from 'ethers';
import {ETHER_NATIVE_TOKEN, ensure, TEST_EXECUTION_OPTIONS} from '@universal-login/commons';
import {createWallet} from '../../helpers';
import {DeployedWallet} from '../../../src';

chai.use(solidity);

describe('INT: WalletService', async () => {
  let walletService: WalletService;
  let sdk: UniversalLoginSDK;
  let relayer: Relayer;
  let wallet: Wallet;

  before(async () => {
    ([wallet] = await getWallets(createMockProvider()));
    ({sdk, relayer} = await setupSdk(wallet));
  });

  beforeEach(() => {
    walletService = new WalletService(sdk);
  });

  it('create wallet', async () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});
    const name = 'name.mylogin.eth';
    const futureWallet = await walletService.createFutureWallet(name);
    expect(futureWallet.contractAddress).to.be.properAddress;
    expect(futureWallet.privateKey).to.be.properPrivateKey;
    expect(futureWallet.deploy).to.be.a('function');
    expect(futureWallet.waitForBalance).to.be.a('function');
    expect(walletService.state).to.deep.eq({kind: 'Future', name, wallet: futureWallet});
  });

  describe('deploy, wait for transaction hash and success', () => {
    it('transaction upfront', async () => {
      const futureWallet = await walletService.createFutureWallet('name.mylogin.eth');
      walletService.setGasParameters({gasToken: ETHER_NATIVE_TOKEN.address, gasPrice: utils.bigNumberify('1')});
      await wallet.sendTransaction({to: futureWallet.contractAddress, value: utils.parseEther('4')});
      await walletService.initDeploy();
      ensure(walletService.state.kind === 'Deploying', chai.AssertionError, `Expected state.kind to be 'Deploying', but was ${walletService.state.kind}`);
      expect(walletService.state.wallet.deploymentHash).to.be.properHex(64);
      expect(walletService.state.transactionHash).to.be.undefined;

      await walletService.waitForTransactionHash();
      expect(walletService.state.kind).to.eq('Deploying');
      expect(walletService.state.transactionHash).to.be.properHex(64);

      await walletService.waitToBeSuccess();
      expect(walletService.state.kind).to.eq('Deployed');
      expect(walletService.getDeployedWallet().name).to.eq('name.mylogin.eth');
    });
  });

  describe('Connect wallet', () => {
    const ensName = 'name2.mylogin.eth';
    let existingDeployedWallet: DeployedWallet;

    before(async () => {
      existingDeployedWallet = await createWallet(ensName, sdk, wallet);
      sdk.start();
    });

    it('simple connect', async () => {
      expect(walletService.state).to.deep.eq({kind: 'None'});
      await walletService.initializeConnection(ensName);
      expect(walletService.state.kind).to.eq('Connecting');
      ensure(walletService.state.kind === 'Connecting', chai.AssertionError, `Expected state.kind to be 'Connecting', but was ${walletService.state.kind}`);
      expect(walletService.state.wallet.contractAddress).to.eq(existingDeployedWallet.contractAddress);
      expect(walletService.state.wallet.name).to.eq(ensName);
      expect(walletService.state.wallet.privateKey).to.be.properHex(64);
      existingDeployedWallet.addKey(walletService.getConnectingWallet().publicKey, TEST_EXECUTION_OPTIONS);
      await walletService.waitForConnection();
      expect(walletService.state).to.deep.include({kind: 'Deployed'});
    });

    it('cancelation', async () => {
      expect(walletService.state).to.deep.eq({kind: 'None'});
      await walletService.initializeConnection(ensName);
      walletService.waitForConnection();
      const publicKey = walletService.getConnectingWallet().publicKey;
      walletService.cancelWaitForConnection();
      const execution = await existingDeployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS);
      await execution.waitToBeSuccess();
      expect(walletService.state).to.deep.eq({kind: 'None'});
    });

    it('waitForConnection doesn`t crash for Deployed wallet', async () => {
      expect(walletService.state).to.deep.eq({kind: 'None'});
      await walletService.initializeConnection(ensName);
      const execution = await existingDeployedWallet.addKey(walletService.getConnectingWallet().publicKey, TEST_EXECUTION_OPTIONS);
      await execution.waitToBeSuccess();
      await walletService.waitForConnection();
      expect(walletService.state).to.deep.include({kind: 'Deployed'});
      await walletService.waitForConnection();
      expect(walletService.state).to.deep.include({kind: 'Deployed'});
      await walletService.cancelWaitForConnection();
      expect(walletService.state).to.deep.include({kind: 'Deployed'});
    });

    it('cancelWaitForConnection doesn`t disconnect Deployed wallet', async () => {
      expect(walletService.state).to.deep.eq({kind: 'None'});
      await walletService.initializeConnection(ensName);
      const execution = await existingDeployedWallet.addKey(walletService.getConnectingWallet().publicKey, TEST_EXECUTION_OPTIONS);
      await execution.waitToBeSuccess();
      await walletService.waitForConnection();
      await walletService.cancelWaitForConnection();
      expect(walletService.state).to.deep.include({kind: 'Deployed'});
    });

    after(async () => {
      await sdk.finalizeAndStop();
    });
  });

  after(async () => {
    await relayer.stop();
  });
});
