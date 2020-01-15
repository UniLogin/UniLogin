import {BlockchainService} from '@universal-login/contracts';
import {WalletVersion} from '@universal-login/commons';
import {utils} from 'ethers';

export interface IWalletContractService {
  lastNonce: (walletAddress: string) => Promise<number>;
  keyExist: (walletAddress: string, key: string) => Promise<boolean>;
  requiredSignatures: (walletAddress: string) => Promise<utils.BigNumber>;
  signMessage: (privateKey: string, message: Uint8Array) => Promise<string>;
  encodeFunction: (method: string, args?: any[]) => Promise<string>;
}

export class WalletContractService {
  private walletVersion?: WalletVersion;

  constructor(private blockchainService: BlockchainService, private beta2Service: IWalletContractService) {
  }

  async getWalletService(walletAddress: string): Promise<IWalletContractService> {
    this.walletVersion = this.walletVersion || await this.blockchainService.fetchWalletVersion(walletAddress);
    switch (this.walletVersion) {
      case 'beta1':
      case 'beta2':
        return this.beta2Service;
      default:
        throw TypeError(`Invalid walletVersion: ${this.walletVersion}`);
    }
  }

  async lastNonce(walletAddress: string) {
    const service = await this.getWalletService(walletAddress);
    return service.lastNonce(walletAddress);
  }

  async keyExist(walletAddress: string, key: string) {
    const service = await this.getWalletService(walletAddress);
    return service.keyExist(walletAddress, key);
  }

  async requiredSignatures(walletAddress: string) {
    const service = await this.getWalletService(walletAddress);
    return service.requiredSignatures(walletAddress);
  }

  async signMessage(walletAddress: string, privateKey: string, message: Uint8Array) {
    const service = await this.getWalletService(walletAddress);
    return service.signMessage(privateKey, message);
  }

  async encodeFunction(walletAddress: string, method: string, args?: any[]) {
    const service = await this.getWalletService(walletAddress);
    return service.encodeFunction(method, args);
  }
}
