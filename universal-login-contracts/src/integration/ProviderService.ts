import {Contract, providers, utils} from 'ethers';
import {ensureNotFalsy, fetchHardforkVersion, PROXY_VERSIONS, isContract, ensure, InvalidContract} from '@unilogin/commons';
import {interfaces} from '../beta2/contracts';
import {IProxyInterface} from '../gnosis-safe@1.1.1/interfaces';

const {WalletProxyInterface, WalletProxyFactoryInterface} = interfaces;

export class ProviderService {
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


  async fetchProxyVersion(contractAddress: string) {
    const proxyBytecode = await this.getCode(contractAddress);
    ensure(proxyBytecode !== '0x', InvalidContract, contractAddress);
    const proxyVersion = PROXY_VERSIONS[utils.keccak256(proxyBytecode)];
    ensureNotFalsy(proxyVersion, Error, 'Unsupported proxy version');
    return proxyVersion;
  }

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

  async fetchHardforkVersion() {
    return fetchHardforkVersion(this.provider);
  }
}
