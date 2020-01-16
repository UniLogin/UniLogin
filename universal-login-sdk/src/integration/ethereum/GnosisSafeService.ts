import {providers, Contract} from 'ethers';
import {GnosisSafeInterface, signStringMessage, calculateGnosisStringHash} from '@universal-login/contracts';
import {IWalletContractServiceStrategy} from './WalletContractService';
import {ensureNotFalsy} from '@universal-login/commons';
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

  encodeFunction(method: string, args?: any[]) {
    return GnosisSafeInterface.functions[method].encode(args || []);
  }
};
