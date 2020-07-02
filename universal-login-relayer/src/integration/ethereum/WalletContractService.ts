import {Beta2Service} from './Beta2Service';
import {ContractService} from '@unilogin/contracts';
import {SignedMessage, RelayerRequest, WalletVersion, isProperAddress, ensure} from '@unilogin/commons';
import IWalletContractService from '../../core/models/IWalletContractService';
import {GnosisSafeService} from './GnosisSafeService';
import {utils} from 'ethers';

export class WalletContractService {
  private walletVersions: Record<string, WalletVersion | undefined> = {};

  constructor(private contractService: ContractService, private beta2Service: Beta2Service, private gnosisSafeService: GnosisSafeService) {
  }

  private async getWalletService(walletAddress: string): Promise<IWalletContractService> {
    const walletVersion = await this.getWalletVersion(walletAddress);
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

  async getWalletVersion(walletAddress: string) {
    if (this.walletVersions[walletAddress] !== undefined) {
      return this.walletVersions[walletAddress];
    } else {
      ensure(walletAddress !== undefined && isProperAddress(walletAddress), Error, 'Invalid address provided');
      const walletVersion = await this.contractService.fetchWalletVersion(walletAddress);
      this.walletVersions[walletAddress] = walletVersion;
      return walletVersion;
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

  async messageToTransaction(message: SignedMessage, tokenGasPriceInEth: utils.BigNumberish) {
    const service = await this.getWalletService(message.from);
    return service.messageToTransaction(message, tokenGasPriceInEth);
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

  async decodeKeyFromData(walletAddress: string, data: string) {
    const service = await this.getWalletService(walletAddress);
    return service.decodeKeyFromData(data);
  }

  async decodeKeysFromData(walletAddress: string, data: string) {
    const service = await this.getWalletService(walletAddress);
    return service.decodeKeysFromData(data);
  }

  async decodeExecute(walletAddress: string, data: string) {
    const service = await this.getWalletService(walletAddress);
    return service.decodeExecute(data);
  }

  async isValidMessageHash(walletAddress: string, messageHash: string, signedMessage: SignedMessage) {
    const service = await this.getWalletService(walletAddress);
    return service.isValidMessageHash(messageHash, signedMessage);
  }
};
