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

chai.use(chaiAsPromised);

describe('INT: ULWeb3Provider', () => {
  let relayer: RelayerUnderTest;
  let deployer: Wallet;
  let services: ULWeb3RootProps;
  let web3: Web3;
  let ulProvider: any;

  beforeEach(async () => {
    ({relayer, deployer, services, web3, ulProvider} = await setupTestEnvironmentWithWeb3());
    ulProvider.uiController.confirmRequest = sinon.stub().resolves({isConfirmed: true, gasParameters: {}});
    ulProvider.uiController.signChallenge = sinon.stub().resolves(true);
  });

  afterEach(async () => {
    sinon.restore();
    await ulProvider.finalizeAndStop();
    await relayer.clearDatabase();
    await relayer.stop();
  });

  describe('send transaction', () => {
    const deployWallet = async () => {
      const deployedWallet = await createWallet('bob.mylogin.eth', services.sdk, deployer);
      services.walletService.setWallet(deployedWallet.asApplicationWallet);
      return deployedWallet;
    };

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

    describe('can send a simple eth transfer', () => {
      let showTransactionHashSpy: sinon.SinonSpy;
      let showWaitForTransactionSpy: sinon.SinonSpy;
      let hideModalSpy: sinon.SinonSpy;
      let hideWaitForTransactionSpy: sinon.SinonSpy;

      const sendTransactionWithWeb3ToRandom = () => web3.eth.sendTransaction({
        to: Wallet.createRandom().address,
        value: utils.parseEther('0.005').toString(),
      });

      beforeEach(() => {
        hideModalSpy = sinon.spy(ulProvider.uiController, 'hideModal');
        hideWaitForTransactionSpy = sinon.spy(ulProvider.uiController, 'hideWaitForTransaction');
        showTransactionHashSpy = sinon.spy(ulProvider.uiController, 'showTransactionHash');
      });

      it('with closing waitForTransaction modal', async () => {
        showWaitForTransactionSpy = sinon.spy(() => ulProvider.uiController.hideModal());
        sinon.replace(ulProvider.uiController, 'showWaitForTransaction', showWaitForTransactionSpy);

        const deployedWallet = await deployWallet();
        const {transactionHash} = await sendTransactionWithWeb3ToRandom();
        const receipt = await web3.eth.getTransactionReceipt(transactionHash);

        expect(receipt.to).to.eq(deployedWallet.contractAddress.toLowerCase());
        expect(showWaitForTransactionSpy).calledOnce;
        expect(showTransactionHashSpy).calledOnceWithExactly(transactionHash);
        await waitExpect(() => expect(hideWaitForTransactionSpy).calledOnceWithExactly());
        expect(hideModalSpy).calledOnceWithExactly();
      });

      it('without closing waitForTransaction modal', async () => {
        showWaitForTransactionSpy = sinon.spy(ulProvider.uiController, 'showWaitForTransaction');

        const deployedWallet = await deployWallet();
        const {transactionHash} = await sendTransactionWithWeb3ToRandom();
        const receipt = await web3.eth.getTransactionReceipt(transactionHash);

        expect(receipt.to).to.eq(deployedWallet.contractAddress.toLowerCase());
        expect(showWaitForTransactionSpy).calledTwice;
        expect(showTransactionHashSpy).calledOnceWithExactly(transactionHash);
        await waitExpect(() => expect(hideWaitForTransactionSpy).calledOnceWithExactly());
        expect(hideModalSpy).calledOnceWithExactly();
      });
    });

    it('sends transactions that originated before wallet was created', async () => {
      const promise = web3.eth.sendTransaction({
        to: Wallet.createRandom().address,
        value: utils.parseEther('0.005').toString(),
      });

      const deployedWallet = await deployWallet();

      const {transactionHash} = await promise;
      const receipt = await web3.eth.getTransactionReceipt(transactionHash);
      expect(receipt.to).to.eq(deployedWallet.contractAddress.toLowerCase());
    });
  });

  describe('get accounts', () => {
    it('initialize onboarding when wallet does not exist', async () => {
      const initOnboardingSpy = sinon.spy(() => Promise.resolve());
      sinon.replace(ulProvider, 'initOnboarding', initOnboardingSpy);
      expect(await web3.eth.getAccounts()).to.deep.eq([]);
      expect(initOnboardingSpy.called).to.be.false;
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
      const initOnboardingSpy = sinon.spy(() => Promise.resolve());
      sinon.replace(ulProvider, 'initOnboarding', initOnboardingSpy);
      expect(await requestAccounts()).to.deep.eq([]);
      expect(initOnboardingSpy.calledOnce).to.be.true;
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

      await waitExpect(() => expect(services.uiController.activeModal.get()).to.deep.eq({kind: 'ONBOARDING'}));

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
