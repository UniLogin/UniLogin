import chai, {expect} from 'chai';
import {getWallets, createMockProvider, solidity} from 'ethereum-waffle';
import Relayer from '@universal-login/relayer';
import {setupSdk} from '../../helpers/setupSdk';
import UniversalLoginSDK from '../../../lib/api/sdk';
import {WalletService} from '../../../lib/core/services/WalletService';
import {Wallet, utils} from 'ethers';
import {ETHER_NATIVE_TOKEN, ensure} from '@universal-login/commons';

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

  after(async () => {
    await relayer.stop();
  });
});
