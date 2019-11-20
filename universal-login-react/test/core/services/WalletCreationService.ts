import {expect} from 'chai';
import {WalletCreationService} from '../../../src/core/services/WalletCreationService';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {setupSdk} from '@universal-login/sdk/testutils';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {RelayerUnderTest} from '@universal-login/relayer';
import {Wallet, utils} from 'ethers';
import {INITIAL_GAS_PARAMETERS, ETHER_NATIVE_TOKEN} from '@universal-login/commons';

describe('INT: WalletCreationService', () => {
  let walletService: WalletService;
  let sdk: UniversalLoginSDK;
  let walletCreationService: WalletCreationService;
  let relayer: RelayerUnderTest;
  let wallet: Wallet;
  let otherWallet: Wallet;

  beforeEach(async () => {
    [wallet, otherWallet] = getWallets(createMockProvider());
    ({sdk, relayer} = await setupSdk(wallet, '34999'));
    walletService = new WalletService(sdk);
    walletCreationService = new WalletCreationService(walletService);
  });

  it('initiates creation flow', async () => {
    await walletCreationService.initiateCreationFlow('name.mylogin.eth');
    expect(walletService.state.kind).to.eq('Future');
  });

  describe('deployWhenReady', () => {
    it('deploys when wallet is already Future', async () => {
      const futureWallet = await walletService.createFutureWallet('name.mylogin.eth');
      await otherWallet.sendTransaction({to: futureWallet.contractAddress, value: utils.parseEther('4')});

      walletCreationService.setGasParameters({gasToken: ETHER_NATIVE_TOKEN.address, gasPrice: utils.bigNumberify('1')});

      const deployedWallet = await walletCreationService.deployWhenReady();

      expect(deployedWallet.name).to.eq('name.mylogin.eth');
      expect(walletService.state.kind).to.eq('Deployed');
    });

    it('waits for the wallet to become future before deploying', async () => {
      walletCreationService.setGasParameters({...INITIAL_GAS_PARAMETERS, gasPrice: utils.bigNumberify('1')});
      const promise = walletCreationService.deployWhenReady();

      const futureWallet = await walletService.createFutureWallet('name.mylogin.eth');
      otherWallet.sendTransaction({to: futureWallet.contractAddress, value: utils.parseEther('1')});

      const deployedWallet = await promise;
      expect(deployedWallet.name).to.eq('name.mylogin.eth');
      expect(walletService.state.kind).to.eq('Deployed');
    });
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
