import {providers, utils} from 'ethers';
import WalletService from '../WalletService';

export class EtherBalanceService {
  constructor(private provider: providers.Provider, private walletService: WalletService) {}

  getBalance = () =>
    this.walletService.walletExists() ?
      this.provider.getBalance(this.walletService.userWallet!.contractAddress) :
      utils.bigNumberify(0)
}
