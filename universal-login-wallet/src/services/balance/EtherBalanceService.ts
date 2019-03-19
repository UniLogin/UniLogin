import {providers} from 'ethers';
import {UserWallet} from '../WalletService';
import {Partial} from 'universal-login-commons';

export class EtherBalanceService {
  constructor(private provider: providers.Provider, private userWallet: Partial<UserWallet>) {}

  getBalance = () => 
    this.userWallet.contractAddress ? this.provider.getBalance(this.userWallet.contractAddress) : null; 
}