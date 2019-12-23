import {Contract, providers, utils} from 'ethers';
import {computeCounterfactualAddress, createKeyPair, WALLET_MASTER_VERSIONS, ensureNotNull, fetchHardforkVersion} from '@universal-login/commons';
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

  async fetchWalletVersion(contractAddress: string) {
    const proxyInstance = new Contract(contractAddress, WalletProxyInterface as any, this.provider);
    const walletMasterAddress = await proxyInstance.implementation();
    const walletMasterBytecode = await this.getCode(walletMasterAddress);
    const walletMasterVersion = WALLET_MASTER_VERSIONS[utils.keccak256(walletMasterBytecode)];
    ensureNotNull(walletMasterVersion, Error, 'Unsupported wallet master version');
    return walletMasterVersion;
  }

  async fetchHardforkVersion() {
    return fetchHardforkVersion(this.provider);
  }
}
