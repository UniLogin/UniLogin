import {providers, Contract, utils} from 'ethers';
import {SignedMessage} from '@universal-login/commons';
import {GnosisSafeInterface, calculateMessageHash, IProxyInterface} from '@universal-login/contracts';
import IWalletContractService from '../../core/models/IWalletContractService';

export class GnosisSafeService implements IWalletContractService {
  constructor(private provider: providers.Provider) {
  }

  async getRequiredSignatures(walletAddress: string): Promise<utils.BigNumber> {
    const walletContract = new Contract(walletAddress, GnosisSafeInterface, this.provider);
    const requiredSignatures = await walletContract.getThreshold();
    return requiredSignatures;
  }

  async keyExist(walletAddress: string, key: string) {
    const walletContract = new Contract(walletAddress, GnosisSafeInterface, this.provider);
    return walletContract.isOwner(key);
  }

  calculateMessageHash(message: SignedMessage) {
    return calculateMessageHash(message);
  }

  recoverSignerFromMessage(message: SignedMessage) {
    return utils.verifyMessage(
      this.calculateMessageHash(message),
      message.signature,
    );
  }

  fetchMasterAddress(walletAddress: string): Promise<string> {
    const walletProxy = new Contract(walletAddress, IProxyInterface, this.provider);
    return walletProxy.masterCopy();
  }
}
