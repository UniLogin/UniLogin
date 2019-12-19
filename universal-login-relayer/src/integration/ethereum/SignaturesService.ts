import {Contract, utils, Wallet} from 'ethers';
import {WalletContractInterface} from '@universal-login/contracts';

export class SignaturesService {
  constructor(private wallet: Wallet) {
  }

  async getRequiredSignatures(walletAddress: string): Promise<utils.BigNumber> {
    const walletContract = new Contract(walletAddress, WalletContractInterface, this.wallet);
    const requiredSignatures = await walletContract.requiredSignatures();
    return requiredSignatures;
  }
}
