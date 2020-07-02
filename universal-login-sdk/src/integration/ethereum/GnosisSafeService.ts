import {providers, Contract, utils} from 'ethers';
import {GnosisSafeInterface, signStringMessage, calculateGnosisStringHash, getPreviousOwner, encodeDataForExecTransaction} from '@unilogin/contracts';
import {IWalletContractServiceStrategy} from './WalletContractService';
import {ensureNotFalsy, RelayerRequest, ensure, SignedMessage} from '@unilogin/commons';
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

  signMessage(privateKey: string, message: Uint8Array, walletAddress?: string) {
    ensureNotFalsy(walletAddress, WalletNotFound);
    const messageHash = calculateGnosisStringHash(message, walletAddress);
    return signStringMessage(messageHash, privateKey);
  }

  getOwners(walletAddress: string): Promise<string[]> {
    return this.getContractInstance(walletAddress).getOwners();
  }

  async encodeFunction(method: string, args?: any[], walletAddress?: string) {
    switch (method) {
      case 'addKey':
        ensureNotFalsy(walletAddress, WalletNotFound);
        ensureNotFalsy(args, TypeError, 'Public key is not provided');
        return GnosisSafeInterface.functions.addOwnerWithThreshold
          .encode([...args, await this.requiredSignatures(walletAddress)]);
      case 'removeKey':
        ensureNotFalsy(walletAddress, WalletNotFound);
        ensureNotFalsy(args, TypeError, 'Public key is not provided');
        const owners = await this.getOwners(walletAddress);
        return GnosisSafeInterface.functions.removeOwner
          .encode([getPreviousOwner(owners, args[0]), args[0], await this.requiredSignatures(walletAddress)]);
      case 'setRequiredSignatures':
        ensure(args?.length === 1, TypeError, 'Number of required signatures is not provided');
        return GnosisSafeInterface.functions.changeThreshold.encode(args);
      default:
        throw TypeError(`Invalid method: ${method}`);
    };
  }

  encodeExecute(message: SignedMessage) {
    return encodeDataForExecTransaction(message);
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
    const signature = this.signMessage(privateKey, utils.arrayify(utils.toUtf8Bytes(relayerRequest.contractAddress)), relayerRequest.contractAddress);
    relayerRequest.signature = signature;
    return relayerRequest;
  }
};
