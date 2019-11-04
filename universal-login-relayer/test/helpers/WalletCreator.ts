import fetch from 'node-fetch';
import {Wallet, Contract, utils} from 'ethers';
import {
  calculateInitializeSignature,
  createKeyPair,
  computeCounterfactualAddress,
  http,
  HttpFunction,
  PublicRelayerConfig,
  ETHER_NATIVE_TOKEN,
  TEST_APPLICATION_INFO,
  TEST_GAS_PRICE,
} from '@universal-login/commons';
import {encodeInitializeWithENSData} from '@universal-login/contracts';
import WalletProxyFactory from '@universal-login/contracts/build/WalletProxyFactory.json';
import ENSService from '../../lib/integration/ethereum/ensService';
import {RelayerUnderTest} from '../../lib';
import {waitForDeploymentStatus} from './waitForDeploymentStatus';

export class WalletCreator {
  private http: HttpFunction;
  private ensService?: ENSService;
  private relayerConfig: PublicRelayerConfig;
  private relayerUrl: string;

  constructor(relayer: RelayerUnderTest, private wallet: Wallet) {
    this.relayerUrl = relayer.url();
    this.http = http(fetch)(this.relayerUrl);
    this.relayerConfig = relayer.publicConfig;
  }

  private async fetchEnsService() {
    const {chainSpec: {ensAddress}} = await this.relayerConfig;
    if (this.ensService) {
      return this.ensService;
    }
    this.ensService = new ENSService(ensAddress, ['mylogin.eth'], this.wallet.provider);
    await this.ensService.start();
    return this.ensService;
  }

  private async getInitCode(factoryAddress: string) {
    const factoryContract = new Contract(factoryAddress, WalletProxyFactory.interface, this.wallet.provider);
    return factoryContract.initCode();
  }

  private async setupInitData(publicKey: string, ensName: string, gasPrice: string) {
    const ensService = await this.fetchEnsService();
    const args = await ensService.argsFor(ensName) as string[];
    const initArgs = [publicKey, ...args, gasPrice, ETHER_NATIVE_TOKEN.address];
    return encodeInitializeWithENSData(initArgs);
  }

  async createFutureWallet() {
    await this.fetchEnsService();
    const {factoryAddress} = await this.relayerConfig;
    const keyPair = createKeyPair();
    const futureContractAddress = computeCounterfactualAddress(factoryAddress, keyPair.publicKey, await this.getInitCode(factoryAddress));
    return {privateKey: keyPair.privateKey, contractAddress: futureContractAddress, publicKey: keyPair.publicKey};
  }

  private async getSignature(privateKey: string, publicKey: string, ensName: string) {
    const initData = await this.setupInitData(publicKey, ensName, TEST_GAS_PRICE);
    return calculateInitializeSignature(initData, privateKey);
  }

  async deployWallet(ensName = 'name.mylogin.eth') {
    const {contractAddress, privateKey, publicKey} = await this.createFutureWallet();
    await this.wallet.sendTransaction({to: contractAddress, value: utils.parseEther('1.0')});
    const signature = await this.getSignature(privateKey, publicKey, ensName);
    const result = await this.http('POST', '/wallet/deploy', {
      publicKey,
      ensName,
      gasPrice: TEST_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      signature,
      applicationInfo: TEST_APPLICATION_INFO,
    });
    await waitForDeploymentStatus(this.relayerUrl, result.deploymentHash, 'Success');
    return {privateKey, contractAddress, publicKey};
  }
}
