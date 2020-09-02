import {expect} from 'chai';
import sinon from 'sinon';
import {Wallet, utils} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import {
  DEFAULT_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
  ETHER_NATIVE_TOKEN,
  generateCode,
} from '@unilogin/commons';
import {waitExpect} from '@unilogin/commons/testutils';
import UniLoginSdk, {WalletService} from '@unilogin/sdk';
import {setupSdk, createAndSetWallet} from '@unilogin/sdk/testutils';
import Relayer from '@unilogin/relayer';
import {DeployedWallet} from '@unilogin/sdk';

describe('Login', () => {
  let walletService: WalletService;
  let walletServiceForConnect: WalletService;
  let sdk: UniLoginSdk;
  let relayer: Relayer;
  let wallet: Wallet;
  let name: string;
  let privateKey: string;
  let contractAddress: string;

  before(async () => {
    [wallet] = new MockProvider().getWallets();
    ({sdk, relayer} = await setupSdk(wallet, '33113'));
    walletService = new WalletService(sdk);
    walletServiceForConnect = new WalletService(sdk);
    (sdk.walletEventsObserverFactory as any).lastBlock = 0;
    await sdk.start();
  });

  describe('CreationService', () => {
    it('should create contract wallet', async () => {
      name = 'name.mylogin.eth';
      const {contractAddress, waitForBalance, privateKey} = await walletService.createFutureWallet(name);
      await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
      await waitForBalance();
      await walletService.deployFutureWallet();

      expect(privateKey).to.not.be.null;
      expect(contractAddress).to.not.be.null;
      expect(walletService.getDeployedWallet().asSerializedDeployedWithoutEmailWallet).to.deep.eq({name, privateKey, contractAddress});
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
      const {unsubscribe, securityCode} = await walletServiceForConnect.connect(name, callback);
      const newPublicKey = utils.computeAddress((walletServiceForConnect.state as any).wallet.privateKey);
      const expectedSecurityCode = generateCode(newPublicKey);
      expect(unsubscribe).to.not.be.null;
      const deployedWallet = new DeployedWallet(contractAddress, '', privateKey, sdk, '');
      const {waitToBeSuccess} = await deployedWallet.addKey(newPublicKey, {gasToken: ETHER_NATIVE_TOKEN.address, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
      await waitToBeSuccess();
      await waitExpect(() => expect(!!callback.firstCall).to.be.true);
      expect(securityCode).to.deep.eq(expectedSecurityCode);
    });
  });

  afterEach(async () => {
    walletService.disconnect();
    walletServiceForConnect.disconnect();
  });

  after(async () => {
    await sdk.finalizeAndStop();
    await relayer.stop();
  });
});
