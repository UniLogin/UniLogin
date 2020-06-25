import {ContractService} from '@unilogin/contracts';
import {WalletVersion, RelayerRequest, SignedMessage} from '@unilogin/commons';
import {utils} from 'ethers';
import {GnosisSafeService} from './GnosisSafeService';
import {WalletEventType} from '../../core/models/events';

export interface IWalletContractServiceStrategy {
  lastNonce: (walletAddress: string) => Promise<number>;
  keyExist: (walletAddress: string, key: string) => Promise<boolean>;
  requiredSignatures: (walletAddress: string) => Promise<utils.BigNumber>;
  signMessage: (privateKey: string, message: Uint8Array, walletAddress: string) => string;
  encodeFunction: (method: string, args?: any[], walletAddress?: string) => Promise<string> | string;
  getEventNameFor: (event: string) => WalletEventType;
  signRelayerRequest: (privateKey: string, relayerRequest: RelayerRequest) => RelayerRequest;
  encodeExecute: (message: SignedMessage) => string;
}

export class WalletContractService {
  private memoizedWalletVersions: Record<string, WalletVersion> = {};

  constructor(private contractService: ContractService, private beta2Service: IWalletContractServiceStrategy, private gnosisSafeService: GnosisSafeService) {
  }

  async getWalletService(walletAddress: string): Promise<IWalletContractServiceStrategy> {
    this.memoizedWalletVersions[walletAddress] = this.memoizedWalletVersions[walletAddress] || await this.contractService.fetchWalletVersion(walletAddress);
    switch (this.memoizedWalletVersions[walletAddress]) {
      case 'beta1':
      case 'beta2':
        return this.beta2Service;
      case 'beta3':
        return this.gnosisSafeService;
      default:
        throw TypeError(`Invalid walletVersion: ${this.memoizedWalletVersions[walletAddress]}`);
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
    return service.signMessage(privateKey, message, walletAddress);
  }

  async encodeFunction(walletAddress: string, method: string, args?: any[]) {
    const service = await this.getWalletService(walletAddress);
    return service.encodeFunction(method, args, walletAddress);
  }

  async getEventNameFor(walletAddress: string, event: string) {
    const service = await this.getWalletService(walletAddress);
    return service.getEventNameFor(event);
  }

  async signRelayerRequest(privateKey: string, relayerRequest: RelayerRequest) {
    const service = await this.getWalletService(relayerRequest.contractAddress);
    return service.signRelayerRequest(privateKey, relayerRequest);
  }

  async encodeExecute(walletAddress: string, message: SignedMessage) {
    const service = await this.getWalletService(walletAddress);
    return service.encodeExecute(message);
  }
}
