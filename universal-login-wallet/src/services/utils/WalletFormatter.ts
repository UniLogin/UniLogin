import WalletService from '../WalletService';
import {ensure} from '@universal-login/commons';

export class WalletFormatter {
  constructor(
    private walletService: WalletService
  ) {}

  getName(): string | null {
    ensure(!!this.walletService.userWallet, Error, 'UserWallet not found');
    return this.walletService.userWallet!.name;
  }
}

export default WalletFormatter;
