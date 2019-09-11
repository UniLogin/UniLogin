import {expect} from 'chai';
import {Wallet} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {TEST_GAS_PRICE, createKeyPair, signRelayerRequest, TEST_PRIVATE_KEY, recoverFromRelayerRequest, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import WalletMasterContractService from '../../../../lib/integration/ethereum/services/WalletMasterContractService';
import setupWalletService, {createFutureWallet} from '../../../helpers/setupWalletService';

describe('INT: WalletMasterContractService', () => {
  let walletMasterContractService: WalletMasterContractService;
  let wallet: Wallet;
  let provider;
  let contractAddress: string;
  const keyPair = createKeyPair();
  const ensName = 'jarek.mylogin.eth';

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    walletMasterContractService = new WalletMasterContractService(provider);
    const {walletService, factoryContract, ensService} = await setupWalletService(wallet);
    const {futureContractAddress, signature} = await createFutureWallet(keyPair, ensName, factoryContract, wallet, ensService);
    await walletService.deploy({publicKey: keyPair.publicKey, ensName, gasPrice: TEST_GAS_PRICE, signature, gasToken: ETHER_NATIVE_TOKEN.address});
    contractAddress = futureContractAddress;
  });

  it('do not throw exception', async () => {
    await expect(walletMasterContractService.ensureValidRelayerRequestSignature(signRelayerRequest({contractAddress}, keyPair.privateKey))).to.be.fulfilled;
  });

  it('throw exception', async () => {
    const relayerRequest = signRelayerRequest({contractAddress}, TEST_PRIVATE_KEY);
    await expect(walletMasterContractService.ensureValidRelayerRequestSignature(relayerRequest)).to.be.rejectedWith(`Unauthorised address: ${recoverFromRelayerRequest(relayerRequest)}`);
  });
});
