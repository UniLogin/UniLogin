import {expect} from 'chai';
import {Wallet} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {TEST_GAS_PRICE, createKeyPair, signRelayerRequest, TEST_PRIVATE_KEY, recoverFromRelayerRequest, ETHER_NATIVE_TOKEN, EMPTY_DEVICE_INFO} from '@universal-login/commons';
import WalletMasterContractService from '../../../src/integration/ethereum/WalletMasterContractService';
import setupWalletService, {createFutureWallet} from '../../testhelpers/setupWalletService';
import createGnosisSafeContract from '../../testhelpers/createGnosisSafeContract';
import {Beta2Service} from '../../../src/integration/ethereum/Beta2Service';
import {BlockchainService, signStringMessage, calculateGnosisStringHash} from '@universal-login/contracts';
import {GnosisSafeService} from '../../../src/integration/ethereum/GnosisSafeService';
import {WalletContractService} from '../../../src/integration/ethereum/WalletContractService';

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
    const beta2Service = new Beta2Service(provider);
    const blockchainService = new BlockchainService(provider);
    const gnosisSafeService = new GnosisSafeService(provider);
    const walletContractService = new WalletContractService(blockchainService, beta2Service, gnosisSafeService);
    const {walletService, factoryContract, ensService} = await setupWalletService(wallet);
    walletMasterContractService = new WalletMasterContractService(provider, walletContractService);
    const {futureContractAddress, signature} = await createFutureWallet(keyPair, ensName, factoryContract, wallet, ensService);
    await walletService.deploy({publicKey: keyPair.publicKey, ensName, gasPrice: TEST_GAS_PRICE, signature, gasToken: ETHER_NATIVE_TOKEN.address}, EMPTY_DEVICE_INFO);
    contractAddress = futureContractAddress;
  });

  it('do not throw exception', async () => {
    await expect(walletMasterContractService.ensureValidRelayerRequestSignature(signRelayerRequest({contractAddress}, keyPair.privateKey))).to.be.fulfilled;
  });

  it('throw exception', async () => {
    const relayerRequest = signRelayerRequest({contractAddress}, TEST_PRIVATE_KEY);
    await expect(walletMasterContractService.ensureValidRelayerRequestSignature(relayerRequest)).to.be.rejectedWith(`Unauthorised address: ${recoverFromRelayerRequest(relayerRequest)}`);
  });

  it('works for GnosisSafe', async () => {
    const {proxy, keyPair} = await createGnosisSafeContract(wallet);
    const msgHash = calculateGnosisStringHash(proxy.address, proxy.address);
    const signature = signStringMessage(msgHash, keyPair.privateKey);
    await expect(walletMasterContractService.ensureValidRelayerRequestSignatureForGnosis({signature, contractAddress: proxy.address})).to.be.fulfilled;
  });
});
