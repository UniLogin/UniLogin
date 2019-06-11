import {expect} from 'chai';
import sinon from 'sinon';
import {Wallet, providers, utils} from 'ethers';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN, MANAGEMENT_KEY, waitExpect} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import CreationSerivice from '../../../src/services/Creation';
import ConnectionToWalletService from '../../../src/services/ConnectToWallet';
import WalletService from '../../../src/services/WalletService';
import {setupSdk} from '../helpers/setupSdk';

describe('Login', () => {
  let creationService: any;
  let connectToWalletService: any;
  let walletService: any;
  let sdk: UniversalLoginSDK;
  let relayer: any;
  let wallet: Wallet;
  let provider: providers.Provider;
  let blockchainObserver: any;
  let name : string;
  let privateKey : string;
  let contractAddress : string;

  before(async () => {
    [wallet] = getWallets(createMockProvider());
    ({sdk, relayer, provider} = await setupSdk(wallet, '33113'));
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
        {gasToken: ETHER_NATIVE_TOKEN.address, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT},
        MANAGEMENT_KEY);
      await waitExpect(() => expect(!!callback.firstCall).to.be.true);
      unsubscribe();
    });
  });

  after(async () => {
    await sdk.stop();
    await relayer.stop();
  });
});
