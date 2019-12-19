import {providers, Contract, utils} from 'ethers';
import {WalletContractInterface} from '@universal-login/contracts';

export class WalletContractService {
  constructor(private provider: providers.Provider) {

  }

  async getRequiredSignatures(walletAddress: string): Promise<utils.BigNumber> {
    const walletContract = new Contract(walletAddress, WalletContractInterface, this.provider);
    const requiredSignatures = await walletContract.requiredSignatures();
    return requiredSignatures;
  }
}
