import fetch from 'node-fetch';
import {Wallet, Contract, utils} from 'ethers';
import {http, HttpFunction, PublicRelayerConfig, createKeyPair, calculateInitializeSignature, computeContractAddress, TEST_GAS_PRICE} from '@universal-login/commons';
import {encodeInitializeWithRefundData} from '@universal-login/contracts';
import ProxyCounterfactualFactory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';
import ENSService from '../../lib/integration/ethereum/ensService';

export class WalletCreator {
  private http: HttpFunction;
  private relayerConfig?: PublicRelayerConfig;
  private ensService?: ENSService;

  constructor(relayerUrl: string, private wallet: Wallet) {
    this.http = http(fetch)(relayerUrl);
  }

  async getRelayerConfig(): Promise<PublicRelayerConfig> {
    this.relayerConfig = this.relayerConfig || (await this.http('GET', '/config')).config;
    return this.relayerConfig!;
  }

  private async getEnsService() {
    const {chainSpec: {ensAddress}} = await this.getRelayerConfig();
    if (this.ensService) {
      return this.ensService;
    }
    this.ensService = new ENSService(ensAddress, ['mylogin.eth'], this.wallet.provider);
    await this.ensService.start();
    return this.ensService;
  }

  private async getInitCode (factoryAddress: string){
    const factoryContract = new Contract(factoryAddress, ProxyCounterfactualFactory.interface, this.wallet.provider);
    return factoryContract.initCode();
  }

  private async setupInitData(publicKey: string, ensName: string, gasPrice: string) {
    const ensService = await this.getEnsService();
    const args = await ensService.argsFor(ensName) as string[];
    const initArgs = [publicKey, ...args, gasPrice];
    return encodeInitializeWithRefundData(initArgs);
  }

  async createFutureWallet() {
    await this.getEnsService();
    const {factoryAddress} = await this.getRelayerConfig();
    const keyPair = createKeyPair();
    const futureContractAddress = computeContractAddress(factoryAddress, keyPair.publicKey, await this.getInitCode(factoryAddress));
    return {privateKey: keyPair.privateKey, contractAddress: futureContractAddress, publicKey: keyPair.publicKey};
  }

  private async getSignature(privateKey: string, publicKey: string, ensName: string) {
    const initData = await this.setupInitData(publicKey, ensName, TEST_GAS_PRICE);
    return calculateInitializeSignature(initData, privateKey);
  }

  async deployWallet(ensName: string = 'name.mylogin.eth') {
    const {contractAddress, privateKey, publicKey} = await this.createFutureWallet();
    await this.wallet.sendTransaction({to: contractAddress, value: utils.parseEther('1.0')});
    const signature = await this.getSignature(privateKey, publicKey, ensName);
    await this.http('POST', '/wallet/deploy', {
      publicKey,
      ensName,
      gasPrice: TEST_GAS_PRICE,
      signature
    });
    return {privateKey, contractAddress, publicKey};
  }
}
