import {utils, providers} from 'ethers';
import {computeCounterfactualAddress, createKeyPair, WALLET_MASTER_VERSIONS, ensureNotFalsy} from '@unilogin/commons';
import {computeGnosisCounterfactualAddress} from '../gnosis-safe@1.1.1/utils';
import {DEPLOY_CONTRACT_NONCE} from '../gnosis-safe@1.1.1/constants';
import {ProviderService} from './ProviderService';

export class ContractService {
  constructor(private providerService: ProviderService) {
  }

  getCode(contractAddress: string) {
    return this.providerService.getCode(contractAddress);
  }

  isContract(address: string) {
    return this.providerService.isContract(address);
  }

  getBlockNumber() {
    return this.providerService.getBlockNumber();
  }

  getLogs(filter: providers.Filter) {
    return this.providerService.getLogs(filter);
  }

  on(eventType: providers.EventType, listener: providers.Listener) {
    return this.providerService.on(eventType, listener);
  }

  removeListener(eventType: providers.EventType, listener: providers.Listener) {
    return this.providerService.removeListener(eventType, listener);
  }

  getInitCode = async (factoryAddress: string) => {
    return this.providerService.getInitCode(factoryAddress);
  };

  createFutureWallet = async (factoryAddress: string) => {
    const {privateKey, publicKey} = createKeyPair();
    const futureContractAddress = computeCounterfactualAddress(factoryAddress, publicKey, await this.providerService.getInitCode(factoryAddress));
    return [privateKey, futureContractAddress, publicKey];
  };

  createFutureGnosis = (factoryAddress: string, gnosisAddress: string, initializeData: string) => {
    const {privateKey, publicKey} = createKeyPair();
    const futureAddress = computeGnosisCounterfactualAddress(factoryAddress, DEPLOY_CONTRACT_NONCE, initializeData, gnosisAddress);
    return [privateKey, futureAddress, publicKey];
  };

  async fetchWalletVersion(contractAddress: string) {
    const walletMasterAddress = await this.providerService.fetchMasterAddress(contractAddress);
    const walletMasterBytecode = await this.providerService.getCode(walletMasterAddress);
    const walletMasterVersion = WALLET_MASTER_VERSIONS[utils.keccak256(walletMasterBytecode)];
    ensureNotFalsy(walletMasterVersion, Error, 'Unsupported wallet master version');
    return walletMasterVersion;
  }

  async fetchHardforkVersion() {
    return this.providerService.fetchHardforkVersion();
  }
}
