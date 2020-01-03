import {Contract, providers, utils} from 'ethers';
import {computeCounterfactualAddress, createKeyPair, WALLET_MASTER_VERSIONS, ensureNotFalsy, fetchHardforkVersion, PROXY_VERSIONS} from '@universal-login/commons';
import {WalletProxyInterface, WalletProxyFactoryInterface} from '../../test/helpers/interfaces';

export class BlockchainService {
  constructor(private provider: providers.Provider) {
  }

  getCode(contractAddress: string) {
    return this.provider.getCode(contractAddress);
  }

  getBlockNumber() {
    return this.provider.getBlockNumber();
  }

  getLogs(filter: providers.Filter) {
    return this.provider.getLogs(filter);
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

  async fetchMasterAddress(contractAddress: string) {
    const proxyInstance = new Contract(contractAddress, WalletProxyInterface as any, this.provider);
    return proxyInstance.implementation();
  }

  async fetchProxyVersion(contractAddress: string) {
    const proxyBytecode = await this.getCode(contractAddress);
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
