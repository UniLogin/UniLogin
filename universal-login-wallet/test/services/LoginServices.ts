import {expect} from 'chai';
import sinon from 'sinon';
import CreationSerivice from '../../src/services/Creation';
import ConnectionToWalletService from '../../src/services/ConnectToWallet';
import WalletService from '../../src/services/WalletService';
import {setupSdk} from 'universal-login-sdk/test';
import UniversalLoginSDK, {MANAGEMENT_KEY} from 'universal-login-sdk';
import {Wallet, providers, utils} from 'ethers';
import {getWallets} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, waitUntil} from 'universal-login-commons';


describe('Login', () => {
  let creationService: any;
  let connectToWalletService: any;
  let walletService: any;
  let sdk: UniversalLoginSDK;
  let relayer: any;
  let wallet: Wallet;
  let provider: providers.Web3Provider;
  let blockchainObserver: any;
  let name : string;
  let privateKey : string;
  let contractAddress : string;

  before(async () => {
    ({sdk, relayer, provider} = await setupSdk({overridePort: 33113}));
    [wallet] = await getWallets(provider);
    walletService = new WalletService();
    creationService = CreationSerivice(sdk, walletService);
    connectToWalletService = ConnectionToWalletService(sdk, walletService);
    ({blockchainObserver} = sdk);
    blockchainObserver.step = 10;
    blockchainObserver.lastBlock = 0;
    await sdk.start();
  });

  describe('CreationService', () => {
    it('should create contract wallet', async () => {
      name = 'name.mylogin.eth';
      [privateKey, contractAddress] = await creationService(name);
      expect(privateKey).to.not.be.null;
      expect(contractAddress).to.not.be.null;

      const userWallet = walletService.userWallet;
      expect(userWallet.name).to.eq(name);
      expect(userWallet.privateKey).to.eq(privateKey);
      expect(userWallet.contractAddress).to.eq(contractAddress);
    });
  });

  describe('ConnectionService', () => {
    before(async () => {
      name = 'super-name.mylogin.eth';
      [privateKey, contractAddress] = await creationService(name);
      await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('1.0')});
    });

    it('should request connect to existing wallet and call callback when add key', async () => {
      const callback = sinon.spy();
      const unsubscribe = await connectToWalletService(name, callback);
      const newPublicKey = (new Wallet(walletService.userWallet.privateKey)).address;
      expect(unsubscribe).to.not.be.null;
      await sdk.addKey(
        contractAddress,
        newPublicKey,
        privateKey,
        {gasToken: ETHER_NATIVE_TOKEN.address, gasPrice: 1000000000, gasLimit: 1000000},
        MANAGEMENT_KEY);
      await waitUntil(() => !!callback.firstCall);
      expect(callback).to.have.been.calledOnce;
      unsubscribe();
    });
  });

  after(async () => {
    await sdk.stop();
    await relayer.stop();
  });
});
