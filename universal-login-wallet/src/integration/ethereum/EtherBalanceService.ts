import {providers, utils} from 'ethers';
import WalletService from '../storage/WalletService';

export class EtherBalanceService {
  constructor(private provider: providers.Provider, private walletService: WalletService) {}

  getBalance = () =>
    this.walletService.walletDeployed() ?
      this.provider.getBalance(this.walletService.applicationWallet!.contractAddress) :
      utils.bigNumberify(0)
}
