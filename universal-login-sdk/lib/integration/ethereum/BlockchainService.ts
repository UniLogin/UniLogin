import {Contract, providers} from 'ethers';
import WalletProxyFactory from '@universal-login/contracts/build/WalletProxyFactory.json';
import {computeCounterfactualAddress, createKeyPair} from '@universal-login/commons';


export class BlockchainService {
  constructor(private provider: providers.Provider){
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
    const factoryContract = new Contract(factoryAddress, WalletProxyFactory.interface, this.provider);
    return factoryContract.initCode();
  }

  createFutureWallet = async (factoryAddress: string) => {
    const {privateKey, publicKey} = createKeyPair();
    const futureContractAddress = computeCounterfactualAddress(factoryAddress, publicKey, await this.getInitCode(factoryAddress));
    return [privateKey, futureContractAddress, publicKey];
  }
}

