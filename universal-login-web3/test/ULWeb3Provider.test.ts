import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import Web3 from 'web3';
import {utils, Wallet} from 'ethers';
import {promisify} from 'util';
import {waitExpect} from '@unilogin/commons/testutils';
import {RelayerUnderTest} from '@unilogin/relayer';
import {createWallet} from '@unilogin/sdk/testutils';
import {ULWeb3RootProps} from '../src/ui/react/ULWeb3Root';
import {setupTestEnvironmentWithWeb3} from './helpers/setupTestEnvironmentWithWeb3';
import {ULWeb3Provider} from '../src';

chai.use(chaiAsPromised);

describe('ULWeb3Provider', () => {
  let relayer: RelayerUnderTest;
  let deployer: Wallet;
  let services: ULWeb3RootProps;
  let web3: Web3;
  let ulProvider: ULWeb3Provider;

  beforeEach(async () => {
    ({relayer, deployer, services, web3, ulProvider} = await setupTestEnvironmentWithWeb3());
    (ulProvider as any).uiController.confirmRequest = sinon.stub().resolves({isConfirmed: true, gasParameters: {}});
    (ulProvider as any).uiController.signChallenge = sinon.stub().resolves(true);
  });

  afterEach(async () => {
    await ulProvider.finalizeAndStop();
    await relayer.clearDatabase();
    await relayer.stop();
  });

  describe('send transaction', () => {
    it('triggers wallet create flow', async () => {
      expect(services.uiController.activeModal.get()).to.deep.eq({kind: 'IDLE'});

      web3.eth.sendTransaction({
        to: Wallet.createRandom().address,
        value: utils.parseEther('0.005').toString(),
      });

      await waitExpect(() => {
        return expect(services.uiController.activeModal.get()).to.deep.eq({kind: 'ONBOARDING'});
      });
    });

    it('can send a simple eth transfer', async () => {
      const deployedWallet = await createWallet('bob.mylogin.eth', services.sdk, deployer);
      services.walletService.setWallet(deployedWallet.asApplicationWallet);
      const {transactionHash} = await web3.eth.sendTransaction({
        to: Wallet.createRandom().address,
        value: utils.parseEther('0.005').toString(),
      });

      const receipt = await web3.eth.getTransactionReceipt(transactionHash);
      expect(receipt.to).to.eq(deployedWallet.contractAddress.toLowerCase());
    });

    it('sends transactions that originated before wallet was created', async () => {
      const promise = web3.eth.sendTransaction({
        to: Wallet.createRandom().address,
        value: utils.parseEther('0.005').toString(),
      });

      const deployedWallet = await createWallet('bob.mylogin.eth', services.sdk, deployer);
      services.walletService.setWallet(deployedWallet.asApplicationWallet);

      const {transactionHash} = await promise;
      const receipt = await web3.eth.getTransactionReceipt(transactionHash);
      expect(receipt.to).to.eq(deployedWallet.contractAddress.toLowerCase());
    });
  });

  describe('get accounts', () => {
    it('initialize onboarding when wallet does not exist', async () => {
      const initOnboardingSpy = sinon.spy(() => null);
      sinon.replace(ulProvider, 'initOnboarding', initOnboardingSpy);
      expect(await web3.eth.getAccounts()).to.deep.eq([]);
      expect(initOnboardingSpy.calledOnce).to.be.true;
      sinon.restore();
    });

    it('returns single address when wallet is connected', async () => {
      const deployedWallet = await createWallet('bob.mylogin.eth', services.sdk, deployer);
      services.walletService.setWallet(deployedWallet.asApplicationWallet);

      expect(await web3.eth.getAccounts()).to.deep.eq([deployedWallet.contractAddress]);
    });
  });

  describe('requestAccounts', () => {
    const requestAccounts = async () => (
      await promisify(ulProvider.send.bind(ulProvider))({method: 'eth_requestAccounts'} as any) as any
    ).result;

    it('initialize onboarding when wallet does not exist', async () => {
      const initOnboardingSpy = sinon.spy(() => null);
      sinon.replace(ulProvider, 'initOnboarding', initOnboardingSpy);
      expect(await requestAccounts()).to.deep.eq([]);
      expect(initOnboardingSpy.calledOnce).to.be.true;
      sinon.restore();
    });

    it('returns single address when wallet is connected', async () => {
      const deployedWallet = await createWallet('bob.mylogin.eth', services.sdk, deployer);
      services.walletService.setWallet(deployedWallet.asApplicationWallet);

      expect(await requestAccounts()).to.deep.eq([deployedWallet.contractAddress]);
    });
  });

  describe('sign', () => {
    const message = 'message';

    it('web3.eth.sign', async () => {
      const deployedWallet = await createWallet('bob.mylogin.eth', services.sdk, deployer);
      services.walletService.setWallet(deployedWallet.asApplicationWallet);

      const signature = await web3.eth.sign(message, deployedWallet.contractAddress);

      const expectedSignature = await deployedWallet.signMessage(utils.toUtf8Bytes(message));
      expect(signature).to.eq(expectedSignature);
    });

    it('web3.eth.personal.sign', async () => {
      const deployedWallet = await createWallet('bob.mylogin.eth', services.sdk, deployer);
      services.walletService.setWallet(deployedWallet.asApplicationWallet);

      // wrong library typedefs here
      const signature = await (web3.eth.personal.sign as any)(message, deployedWallet.contractAddress, '');

      const expectedSignature = await deployedWallet.signMessage(utils.toUtf8Bytes(message));
      expect(signature).to.eq(expectedSignature);
    });
  });

  describe('create', () => {
    it('shows the UI and returns a promise that resolves once the wallet is created', async () => {
      const promise = ulProvider.initOnboarding();

      expect(services.uiController.activeModal.get()).to.deep.eq({kind: 'ONBOARDING'});

      const deployedWallet = await createWallet('bob.mylogin.eth', services.sdk, deployer);
      services.walletService.setWallet(deployedWallet.asApplicationWallet);

      await promise;
      expect(services.uiController.activeModal.get()).to.deep.eq({kind: 'IDLE'});
    });

    it('throw error if wallet is already there', async () => {
      const deployedWallet = await createWallet('bob.mylogin.eth', services.sdk, deployer);
      services.walletService.setWallet(deployedWallet.asApplicationWallet);

      await expect(ulProvider.initOnboarding()).to.be.rejectedWith('Unexpected wallet state: Deployed');
      expect(services.uiController.activeModal.get()).to.deep.eq({kind: 'IDLE'});
    });
  });
});
