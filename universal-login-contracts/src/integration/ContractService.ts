import {utils, Contract} from 'ethers';
import {WALLET_MASTER_VERSIONS, ensureNotFalsy, InvalidContract, ensure, PROXY_VERSIONS, ProviderService} from '@unilogin/commons';
import {interfaces} from '../beta2/contracts';
import {IProxyInterface} from '../gnosis-safe@1.1.1/interfaces';

const {WalletProxyFactoryInterface, WalletProxyInterface} = interfaces;

export class ContractService {
  constructor(private providerService: ProviderService) {
  }

  getInitCode = async (factoryAddress: string) => {
    const factoryContract = new Contract(factoryAddress, WalletProxyFactoryInterface, this.providerService.getProvider());
    return factoryContract.initCode();
  };

  async fetchWalletVersion(contractAddress: string) {
    const walletMasterAddress = await this.fetchMasterAddress(contractAddress);
    const walletMasterBytecode = await this.providerService.getCode(walletMasterAddress);
    const walletMasterVersion = WALLET_MASTER_VERSIONS[utils.keccak256(walletMasterBytecode)];
    ensureNotFalsy(walletMasterVersion, Error, 'Unsupported wallet master version');
    return walletMasterVersion;
  }

  async fetchMasterAddress(contractAddress: string) {
    const proxyVersion = await this.fetchProxyVersion(contractAddress);
    const provider = this.providerService.getProvider();
    switch (proxyVersion) {
      case 'WalletProxy':
        const walletProxyInstance = new Contract(contractAddress, WalletProxyInterface as any, provider);
        return walletProxyInstance.implementation();
      case 'GnosisSafe':
        const gnosisSafeProxy = new Contract(contractAddress, IProxyInterface as any, provider);
        return gnosisSafeProxy.masterCopy();
      default:
        throw TypeError('Unsupported proxy version');
    }
  }

  async fetchProxyVersion(contractAddress: string) {
    const proxyBytecode = await this.providerService.getCode(contractAddress);
    ensure(proxyBytecode !== '0x', InvalidContract, contractAddress);
    const proxyVersion = PROXY_VERSIONS[utils.keccak256(proxyBytecode)];
    ensureNotFalsy(proxyVersion, Error, 'Unsupported proxy version');
    return proxyVersion;
  }
}
