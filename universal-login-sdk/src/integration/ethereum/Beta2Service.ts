import {providers, Contract} from 'ethers';
import {WalletContractInterface} from '@universal-login/contracts';
import {IWalletContractServiceStrategy} from './WalletContractService';
import {sign} from '@universal-login/commons';

export class Beta2Service implements IWalletContractServiceStrategy {
  private contract?: Contract;

  constructor(private provider: providers.Provider) {
  }

  getContractInstance(walletAddress: string) {
    this.contract = this.contract || new Contract(walletAddress, WalletContractInterface, this.provider);
    return this.contract;
  }

  async lastNonce(walletAddress: string) {
    return parseInt(await this.getContractInstance(walletAddress).lastNonce(), 10);
  }

  keyExist(walletAddress: string, key: string) {
    return this.getContractInstance(walletAddress).keyExist(key);
  }

  requiredSignatures(walletAddress: string) {
    return this.getContractInstance(walletAddress).requiredSignatures();
  }

  signMessage(privateKey: string, message: Uint8Array | string) {
    return sign(message, privateKey);
  }

  async encodeFunction(method: string, args?: any[]) {
    return WalletContractInterface.functions[method].encode(args || []);
  }
};
