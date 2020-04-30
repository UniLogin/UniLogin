import {Contract, providers, utils} from 'ethers';
import {computeCounterfactualAddress, createKeyPair, WALLET_MASTER_VERSIONS, ensureNotFalsy, fetchHardforkVersion, PROXY_VERSIONS, isContract, ensure, InvalidContract} from '@unilogin/commons';
import {interfaces} from '../beta2/contracts';
import {IProxyInterface} from '../gnosis-safe@1.1.1/interfaces';
import {computeGnosisCounterfactualAddress} from '../gnosis-safe@1.1.1/utils';
import {DEPLOY_CONTRACT_NONCE} from '../gnosis-safe@1.1.1/constants';

const {WalletProxyInterface, WalletProxyFactoryInterface} = interfaces;

export class BlockchainService {
  constructor(private provider: providers.Provider) {
  }

  getCode(contractAddress: string) {
    return this.provider.getCode(contractAddress);
  }

  isContract(address: string) {
    return isContract(this.provider, address);
  }

  getBlockNumber() {
    return this.provider.getBlockNumber();
  }

  getLogs(filter: providers.Filter) {
    return this.provider.getLogs(filter);
  }

  on(eventType: providers.EventType, listener: providers.Listener) {
    return this.provider.on(eventType, listener);
  }

  removeListener(eventType: providers.EventType, listener: providers.Listener) {
    return this.provider.removeListener(eventType, listener);
  }

  getInitCode = async (factoryAddress: string) => {
    const factoryContract = new Contract(factoryAddress, WalletProxyFactoryInterface, this.provider);
    return factoryContract.initCode();
  };

  createFutureWallet = async (factoryAddress: string) => {
    const {privateKey, publicKey} = createKeyPair();
    const futureContractAddress = computeCounterfactualAddress(factoryAddress, publicKey, await this.getInitCode(factoryAddress));
    return [privateKey, futureContractAddress, publicKey];
  };

  createFutureGnosis = (factoryAddress: string, gnosisAddress: string, initializeData: string) => {
    const {privateKey, publicKey} = createKeyPair();
    const futureAddress = computeGnosisCounterfactualAddress(factoryAddress, DEPLOY_CONTRACT_NONCE, initializeData, gnosisAddress);
    return [privateKey, futureAddress, publicKey];
  };

  async fetchMasterAddress(contractAddress: string) {
    const proxyVersion = await this.fetchProxyVersion(contractAddress);
    switch (proxyVersion) {
      case 'WalletProxy':
        const walletProxyInstance = new Contract(contractAddress, WalletProxyInterface as any, this.provider);
        return walletProxyInstance.implementation();
      case 'GnosisSafe':
        const gnosisSafeProxy = new Contract(contractAddress, IProxyInterface as any, this.provider);
        return gnosisSafeProxy.masterCopy();
      default:
        throw TypeError('Unsupported proxy version');
    }
  }

  async fetchProxyVersion(contractAddress: string) {
    const proxyBytecode = await this.getCode(contractAddress);
    ensure(proxyBytecode !== '0x', InvalidContract, contractAddress);
    const proxyVersion = PROXY_VERSIONS[utils.keccak256(proxyBytecode)];
    ensureNotFalsy(proxyVersion, Error, 'Unsupported proxy version');
    return proxyVersion;
  }

  async fetchWalletVersion(contractAddress: string) {
    const walletMasterAddress = await this.fetchMasterAddress(contractAddress);
    const walletMasterBytecode = await this.getCode(walletMasterAddress);
    const walletMasterVersion = WALLET_MASTER_VERSIONS[utils.keccak256(walletMasterBytecode)];
    ensureNotFalsy(walletMasterVersion, Error, 'Unsupported wallet master version');
    return walletMasterVersion;
  }

  async fetchHardforkVersion() {
    return fetchHardforkVersion(this.provider);
  }
}
