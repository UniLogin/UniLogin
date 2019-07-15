import {Wallet, utils} from 'ethers';
import {getRequiredSignatures} from '../../core/utils/utils';

export class SignaturesService {
  constructor(private wallet: Wallet) {
  }

  async getRequiredSignatures(walletAddress: string): Promise<utils.BigNumber> {
    return getRequiredSignatures(walletAddress, this.wallet);
  }
}
