import {providers} from 'ethers';
import WalletService from '../WalletService';
import {Partial} from 'universal-login-commons';

export class EtherBalanceService {
  constructor(private provider: providers.Provider, private walletService: Partial<WalletService>) {}

  getBalance = () => 
    this.walletService.userWallet && this.walletService.userWallet.contractAddress ? this.provider.getBalance(this.walletService.userWallet.contractAddress) : null; 
}