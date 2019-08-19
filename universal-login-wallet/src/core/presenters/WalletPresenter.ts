import {ensure, ApplicationWallet} from '@universal-login/commons';
import {ApplicationWalletNotFound} from '../errors';
import {WalletService} from '@universal-login/sdk';

export class WalletPresenter {
  constructor(
    private walletService: WalletService
  ) {}

  getName(): string {
    ensure(!!this.walletService.applicationWallet, ApplicationWalletNotFound);
    ensure(this.walletService.state === 'Deployed', Error, 'ApplicationWallet is not deployed yet');
    return (this.walletService.applicationWallet! as ApplicationWallet).name;
  }

  getContractAddress(): string {
    ensure(!!this.walletService.applicationWallet, ApplicationWalletNotFound);
    return this.walletService.applicationWallet!.contractAddress;
  }
}

export default WalletPresenter;
