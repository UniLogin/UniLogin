import {WalletContractService} from './WalletContractService';
import {BlockchainService} from '@universal-login/contracts';
import {SignedMessage} from '@universal-login/commons';

export class ContractService {
  constructor(private blockchainSerivce: BlockchainService, private walletContractService: WalletContractService) {

  }

  private async getWalletService(walletAddress: string): Promise<WalletContractService> {
    const walletVersion = await this.blockchainSerivce.fetchWalletVersion(walletAddress);
    switch (walletVersion) {
      case 'beta2':
        return this.walletContractService;
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
};
