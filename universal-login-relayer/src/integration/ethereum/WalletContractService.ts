import {Beta2Service} from './Beta2Service';
import {BlockchainService} from '@universal-login/contracts';
import {SignedMessage, RelayerRequest} from '@universal-login/commons';
import IWalletContractService from '../../core/models/IWalletContractService';
import {GnosisSafeService} from './GnosisSafeService';

export class WalletContractService {
  constructor(private blockchainSerivce: BlockchainService, private beta2Service: Beta2Service, private gnosisSafeService: GnosisSafeService) {

  }

  private async getWalletService(walletAddress: string): Promise<IWalletContractService> {
    const walletVersion = await this.blockchainSerivce.fetchWalletVersion(walletAddress);
    switch (walletVersion) {
      case 'beta1':
      case 'beta2':
        return this.beta2Service;
      case 'beta3':
        return this.gnosisSafeService;
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

  async isValidSignature(message: string, walletAddress: string, signature: string) {
    const service = await this.getWalletService(walletAddress);
    return service.isValidSignature(message, walletAddress, signature);
  }

  async getRelayerRequestMessage(relayerRequest: RelayerRequest) {
    const service = await this.getWalletService(relayerRequest.contractAddress);
    return service.getRelayerRequestMessage(relayerRequest);
  }

  async recoverFromRelayerRequest(relayerRequest: RelayerRequest) {
    const service = await this.getWalletService(relayerRequest.contractAddress);
    return service.recoverFromRelayerRequest(relayerRequest);
  }

  async messageToTransaction(message: SignedMessage) {
    const service = await this.getWalletService(message.from);
    return service.messageToTransaction(message);
  }

  async isAddKeyCall(walletAddress: string, data: string) {
    const service = await this.getWalletService(walletAddress);
    return service.isAddKeyCall(data);
  }

  async isAddKeysCall(walletAddress: string, data: string) {
    const service = await this.getWalletService(walletAddress);
    return service.isAddKeysCall(data);
  }

  async isRemoveKeyCall(walletAddress: string, data: string) {
    const service = await this.getWalletService(walletAddress);
    return service.isRemoveKeyCall(data);
  }
};
