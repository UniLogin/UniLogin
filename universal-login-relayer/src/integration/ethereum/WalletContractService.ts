import {Beta2Service} from './Beta2Service';
import {BlockchainService} from '@universal-login/contracts';
import {SignedMessage} from '@universal-login/commons';

export class WalletContractService {
  constructor(private blockchainSerivce: BlockchainService, private beta2Service: Beta2Service) {

  }

  private async getWalletService(walletAddress: string): Promise<Beta2Service> {
    const walletVersion = await this.blockchainSerivce.fetchWalletVersion(walletAddress);
    switch (walletVersion) {
      case 'beta2':
        return this.beta2Service;
      default:
        throw TypeError(`Invalid walletVersion: ${walletVersion}`);
    }
  }

  async keyExist(walletAddress: string, key: string) {
    const service = await this.getWalletService(walletAddress);
    return service.keyExist(walletAddress, key);
  };

  async calculateMessageHash(message: SignedMessage) {
    const service = await this.getWalletService(message.from);
    return service.calculateMessageHash(message);
  }

  async recoverSignerFromMessage(message: SignedMessage) {
    const service = await this.getWalletService(message.from);
    return service.recoverSignerFromMessage(message);
  }

  async getRequiredSignatures(walletAddress: string) {
    const service = await this.getWalletService(walletAddress);
    return service.getRequiredSignatures(walletAddress);
  }

  async fetchMasterAddress(walletAddress: string) {
    const service = await this.getWalletService(walletAddress);
    return service.fetchMasterAddress(walletAddress);
  }
};
