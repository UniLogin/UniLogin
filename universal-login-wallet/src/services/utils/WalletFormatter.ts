import WalletService from '../WalletService';
import {ensure} from '@universal-login/commons';

export class WalletFormatter {
  constructor(
    private walletService: WalletService
  ) {}

  getName(): string {
    ensure(!!this.walletService.userWallet, Error, 'UserWallet not found');
    return this.walletService.userWallet!.name;
  }

  getContractAddress(): string {
    ensure(!!this.walletService.userWallet, Error, 'UserWallet not found');
    return this.walletService.userWallet!.contractAddress;
  }
}

export default WalletFormatter;
