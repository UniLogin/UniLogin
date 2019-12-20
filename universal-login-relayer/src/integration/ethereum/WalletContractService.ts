import {providers, Contract, utils} from 'ethers';
import {calculateMessageHash, SignedMessage} from '@universal-login/commons';
import {WalletContractInterface} from '@universal-login/contracts';

export class WalletContractService {
  constructor(private provider: providers.Provider) {
  }

  async getRequiredSignatures(walletAddress: string): Promise<utils.BigNumber> {
    const walletContract = new Contract(walletAddress, WalletContractInterface, this.provider);
    const requiredSignatures = await walletContract.requiredSignatures();
    return requiredSignatures;
  }

  async keyExist(walletAddress: string, key: string) {
    const walletContract = new Contract(walletAddress, WalletContractInterface, this.provider);
    return walletContract.keyExist(key);
  }

  calculateMessageHash(message: SignedMessage) {
    return calculateMessageHash(message);
  }
}
