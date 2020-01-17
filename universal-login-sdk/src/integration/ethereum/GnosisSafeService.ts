import {providers, Contract} from 'ethers';
import {GnosisSafeInterface, signStringMessage, calculateGnosisStringHash, getPreviousOwner} from '@universal-login/contracts';
import {IWalletContractServiceStrategy} from './WalletContractService';
import {ensureNotFalsy, RelayerRequest} from '@universal-login/commons';
import {WalletNotFound} from '../../core/utils/errors';

export class GnosisSafeService implements IWalletContractServiceStrategy {
  private contract?: Contract;

  constructor(private provider: providers.Provider) {
  }

  getContractInstance(walletAddress: string) {
    this.contract = this.contract || new Contract(walletAddress, GnosisSafeInterface, this.provider);
    return this.contract;
  }

  async lastNonce(walletAddress: string) {
    return parseInt(await this.getContractInstance(walletAddress).nonce(), 10);
  }

  keyExist(walletAddress: string, key: string) {
    return this.getContractInstance(walletAddress).isOwner(key);
  }

  requiredSignatures(walletAddress: string) {
    return this.getContractInstance(walletAddress).getThreshold();
  }

  signMessage(privateKey: string, message: Uint8Array | string, walletAddress?: string) {
    ensureNotFalsy(walletAddress, WalletNotFound);
    ensureNotFalsy(typeof message === 'string', TypeError, 'Invalid message type. Expected type: string.');
    const messageHash = calculateGnosisStringHash(message as string, walletAddress);
    return signStringMessage(messageHash, privateKey);
  }

  getOwners(walletAddress: string): Promise<string[]> {
    return this.getContractInstance(walletAddress).getOwners();
  }

  async encodeFunction(method: string, args?: any[], walletAddress?: string) {
    switch (method) {
      case 'addKey':
        ensureNotFalsy(walletAddress, WalletNotFound);
        ensureNotFalsy(args, TypeError, 'Public key not provided.');
        return GnosisSafeInterface.functions.addOwnerWithThreshold
          .encode([...args, await this.requiredSignatures(walletAddress)]);
      case 'removeKey':
        ensureNotFalsy(walletAddress, WalletNotFound);
        ensureNotFalsy(args, TypeError, 'Public key not provided.');
        const owners = await this.getOwners(walletAddress);
        return GnosisSafeInterface.functions.removeOwner
          .encode([getPreviousOwner(owners, args[0]), args[0], await this.requiredSignatures(walletAddress)]);
      case 'setRequiredSignatures':
        return GnosisSafeInterface.functions.changeThreshold.encode(args);
      default:
        throw TypeError(`Invalid method: ${method}`);
    };
  }

  getEventNameFor(event: string) {
    switch (event) {
      case 'KeyAdded':
        return 'AddedOwner';
      case 'KeyRemoved':
        return 'RemovedOwner';
      default:
        throw TypeError(`Invalid event: ${event}`);
    }
  }

  signRelayerRequest(privateKey: string, relayerRequest: RelayerRequest) {
    const signature = this.signMessage(privateKey, relayerRequest.contractAddress, relayerRequest.contractAddress);
    relayerRequest.signature = signature;
    return relayerRequest;
  }
};
