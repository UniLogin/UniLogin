import chai, {expect} from 'chai';
import {MockProvider, solidity} from 'ethereum-waffle';
import {RelayerUnderTest} from '@unilogin/relayer';
import {setupSdk} from '../../helpers/setupSdk';
import UniLoginSdk from '../../../src/api/sdk';
import {WalletService} from '../../../src/core/services/WalletService';
import {Wallet, utils, Contract, providers} from 'ethers';
import {ensure, TEST_EXECUTION_OPTIONS, TEST_REFUND_PAYER, TEST_SDK_CONFIG, ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import {createWallet} from '../../helpers';
import {DeployedWallet} from '../../../src';

chai.use(solidity);

const mockSendConfirmation = (relayer: RelayerUnderTest, cb: any) => {
  relayer['emailService'].sendConfirmationMail = (email: string, code: string) =>
    new Promise((resolve) => {cb(code); resolve();});
};

describe('INT: WalletService', () => {
  let walletService: WalletService;
  let sdk: UniLoginSdk;
  let relayer: RelayerUnderTest;
  let provider: providers.JsonRpcProvider;
  let wallet: Wallet;
  let mockToken: Contract;

  beforeEach(async () => {
    ([wallet] = new MockProvider().getWallets());
    ({sdk, relayer, mockToken, provider} = await setupSdk(wallet));
    await sdk.start();
    walletService = new WalletService(sdk);
  });

  it('create wallet with ether', async () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});
    const name = 'name.mylogin.eth';
    const futureWallet = await walletService.createFutureWallet(name);
    expect(futureWallet.contractAddress).to.be.properAddress;
    expect(futureWallet.privateKey).to.be.properPrivateKey;
    expect(futureWallet.gasToken).to.eq(ETHER_NATIVE_TOKEN.address);
    expect(futureWallet.deploy).to.be.a('function');
    expect(futureWallet.waitForBalance).to.be.a('function');
    expect(walletService.state).to.deep.eq({kind: 'Future', name, wallet: futureWallet});
  });

  it('create wallet with token', async () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});
    const name = 'name.mylogin.eth';
    const futureWallet = await walletService.createFutureWallet(name, mockToken.address);
    expect(futureWallet.contractAddress).to.be.properAddress;
    expect(futureWallet.privateKey).to.be.properPrivateKey;
    expect(futureWallet.gasToken).to.eq(mockToken.address);
    expect(futureWallet.deploy).to.be.a('function');
    expect(futureWallet.waitForBalance).to.be.a('function');
    expect(walletService.state).to.deep.eq({kind: 'Future', name, wallet: futureWallet});
  });

  describe('deploy, wait for transaction hash and success', () => {
    it('transaction upfront', async () => {
      const futureWallet = await walletService.createFutureWallet('name.mylogin.eth');
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

    it('free deployment', async () => {
      const refundPaidSdk = new UniLoginSdk(relayer.url(), provider, {...TEST_SDK_CONFIG, mineableFactoryTimeout: 3000, apiKey: TEST_REFUND_PAYER.apiKey});
      walletService = new WalletService(refundPaidSdk);
      await refundPaidSdk.fetchRelayerConfig();
      await walletService.createDeployingWallet('meme.mylogin.eth');
      await walletService.waitForTransactionHash();
      expect(walletService.state.kind).to.eq('Deploying');
      await walletService.waitToBeSuccess();
      expect(walletService.state.kind).to.eq('Deployed');
    });
  });

  describe('Connect wallet', () => {
    const ensName = 'name2.mylogin.eth';
    let existingDeployedWallet: DeployedWallet;

    beforeEach(async () => {
      existingDeployedWallet = await createWallet(ensName, sdk, wallet);
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
      await walletService.cancelWaitForConnection(2, 30);
      const execution = await existingDeployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS);
      await execution.waitToBeSuccess();
      expect(walletService.state).to.deep.eq({kind: 'None'});
    });

    it('waitForConnection doesn`t crash for Deployed wallet', async () => {
      expect(walletService.state).to.deep.eq({kind: 'None'});
      await walletService.initializeConnection(ensName);
      const waitForConnectionPromise = walletService.waitForConnection();
      const execution = await existingDeployedWallet.addKey(walletService.getConnectingWallet().publicKey, TEST_EXECUTION_OPTIONS);
      await execution.waitToBeSuccess();
      await waitForConnectionPromise;
      expect(walletService.state).to.deep.include({kind: 'Deployed'});
      await walletService.waitForConnection();
      expect(walletService.state).to.deep.include({kind: 'Deployed'});
      await walletService.cancelWaitForConnection();
      expect(walletService.state).to.deep.include({kind: 'Deployed'});
    });

    it('cancelWaitForConnection doesn`t disconnect Deployed wallet', async () => {
      expect(walletService.state).to.deep.eq({kind: 'None'});
      await walletService.initializeConnection(ensName);
      const waitForConnectionPromise = walletService.waitForConnection();
      const execution = await existingDeployedWallet.addKey(walletService.getConnectingWallet().publicKey, TEST_EXECUTION_OPTIONS);
      await execution.waitToBeSuccess();
      await waitForConnectionPromise;
      await walletService.waitForConnection();
      await walletService.cancelWaitForConnection();
      expect(walletService.state).to.deep.include({kind: 'Deployed'});
    });
  });

  describe('Email', () => {
    it('email onboarding roundtrip', async () => {
      const email = 'name@gmail.com';
      const ensName = 'user.mylogin.eth';
      expect(walletService.state).to.deep.eq({kind: 'None'});
      const promise = walletService.createRequestedCreatingWallet(email, ensName);
      expect(walletService.state).to.deep.include({kind: 'RequestedCreating'});
      await promise;
      await expect(walletService.confirmCode('12345')).to.be.rejectedWith('Error: Invalid code: 12345');
      const confirmEmailResult = await walletService.confirmCode(relayer.sentCodes[email]);
      expect(confirmEmailResult).deep.include({email, code: relayer.sentCodes[email]});
      expect(walletService.state).to.deep.include({kind: 'Confirmed'});
      const password = 'password123!';
      const {contractAddress} = await walletService.createFutureWalletWithPassword(password, ETHER_NATIVE_TOKEN.address);
      console.log(contractAddress);
      expect(walletService.state.kind).eq('Future');
      await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('1')});
      await walletService.deployFutureWallet();
      expect(walletService.state.kind).eq('Deployed');
      walletService.disconnect();
      await walletService.createRequestedRestoringWallet(email);
      expect(walletService.state.kind).eq('RequestedRestoring');
      await expect(walletService.confirmCode('12345')).to.be.rejectedWith('Error: Invalid code: 12345');
      await walletService.confirmCode(relayer.sentCodes[email]);
      expect(walletService.state).to.deep.include({kind: 'Restoring'});
      await expect(walletService.restoreWallet('invalid')).to.be.eventually.rejectedWith('invalid password');
      expect(walletService.state).to.deep.include({kind: 'Restoring'});
      await walletService.restoreWallet(password);
      expect(walletService.state).to.deep.include({kind: 'Deployed'});
      expect((walletService.state as any).wallet!).to.deep.include({contractAddress, name: ensName});
    });

    it('after send confirmation e-mail fails retry requestEmailConfirmation works', async () => {
      const email = 'name@gmail.com';
      expect(walletService.state).to.deep.eq({kind: 'None'});
      mockSendConfirmation(relayer, () => {throw new Error('Something happened');});
      const promise = walletService.createRequestedCreatingWallet(email, 'name.unilogin.eth');
      expect(walletService.state).to.deep.include({kind: 'RequestedCreating'});
      await expect(promise).to.be.eventually.rejectedWith('Something happened');
      expect(walletService.state).to.deep.include({kind: 'RequestedCreating'});
      let sentCode: string;
      mockSendConfirmation(relayer, (code: string) => {sentCode = code;});
      await walletService.getRequestedCreatingWallet().requestEmailConfirmation();
      const confirmEmailResult = await walletService.confirmCode(sentCode!);
      expect(confirmEmailResult).deep.include({email, code: sentCode!});
      expect(walletService.state).to.deep.include({kind: 'Confirmed'});
    });
  });

  afterEach(async () => {
    sdk.stop();
    await relayer.stop();
  });
});
