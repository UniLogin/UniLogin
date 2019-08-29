import {Contract, Wallet, utils} from 'ethers';
import WalletContract from '@universal-login/contracts/build/Wallet.json';


export class SignaturesService {
  constructor(private wallet: Wallet) {
  }

  async getRequiredSignatures(walletAddress: string): Promise<utils.BigNumber> {
    const walletContract = new Contract(walletAddress, WalletContract.interface, this.wallet);
    const requiredSignatures = await walletContract.requiredSignatures();
    return requiredSignatures;
  }
}
