import {expect} from 'chai';
import sinon from 'sinon';
import {Wallet, providers, utils} from 'ethers';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {
  DEFAULT_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
  ETHER_NATIVE_TOKEN,
  waitExpect,
  generateCode,
  Procedure,
} from '@universal-login/commons';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {setupSdk, createAndSetWallet} from '@universal-login/sdk/testutils';
import ConnectionToWalletService, {Connection} from '../../../src/core/services/ConnectToWallet';
import Relayer from '@universal-login/relayer';

describe('Login', () => {
  let connectToWalletService: (name: string, callback: Procedure) => Promise<Connection>;
  let walletService: WalletService;
  let walletServiceForConnect: WalletService;
  let sdk: UniversalLoginSDK;
  let relayer: Relayer;
  let wallet: Wallet;
  let provider: providers.Provider;
  let name: string;
  let privateKey: string;
  let contractAddress: string;

  before(async () => {
    [wallet] = getWallets(createMockProvider());
    ({sdk, relayer, provider} = await setupSdk(wallet, '33113'));
    [wallet] = await getWallets(provider);
    walletService = new WalletService(sdk);
    walletServiceForConnect = new WalletService(sdk);
    connectToWalletService = ConnectionToWalletService(sdk, walletServiceForConnect);
    (sdk.blockchainObserver as any).lastBlock = 0;
    await sdk.start();
  });

  describe('CreationService', () => {
    it('should create contract wallet', async () => {
      name = 'name.mylogin.eth';
      const {contractAddress, waitForBalance, deploy, privateKey} = await walletService.createFutureWallet();

      await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
      await waitForBalance();
      await deploy(name, '1');
      walletService.setDeployed(name);

      expect(privateKey).to.not.be.null;
      expect(contractAddress).to.not.be.null;
      expect(walletService.applicationWallet!).to.deep.equal({name, privateKey, contractAddress});
    });
  });

  describe('ConnectionService', () => {
    before(async () => {
      name = 'super-name.mylogin.eth';
      ({privateKey, contractAddress} = await createAndSetWallet(name, walletService, wallet, sdk));
      await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('1.0')});
    });

    it('should request connect to existing wallet and call callback when add key', async () => {
      const callback = sinon.spy();
      const {unsubscribe, securityCode} = await connectToWalletService(name, callback);
      const newPublicKey = utils.computeAddress(walletServiceForConnect.applicationWallet!.privateKey);
      const expectedSecurityCode = await generateCode(newPublicKey);
      expect(unsubscribe).to.not.be.null;
      const {waitToBeMined} = await sdk.addKey(
        contractAddress,
        newPublicKey,
        privateKey,
        {gasToken: ETHER_NATIVE_TOKEN.address, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
      await waitToBeMined();
      await waitExpect(() => expect(!!callback.firstCall).to.be.true);
      expect(securityCode).to.be.deep.eq(expectedSecurityCode);
    });
  });

  afterEach(async () => {
    walletService.disconnect();
    walletServiceForConnect.disconnect();
  });

  after(async () => {
    await sdk.stop();
    await relayer.stop();
  });
});
