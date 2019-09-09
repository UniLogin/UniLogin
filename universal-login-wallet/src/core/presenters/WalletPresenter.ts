import {WalletService} from '@universal-login/sdk';

export class WalletPresenter {
  constructor(
    private walletService: WalletService
  ) {}

  getName(): string {
    return this.walletService.getDeployedWallet().name;
  }

  getContractAddress(): string {
    return this.walletService.getDeployedWallet().contractAddress;
  }
}

export default WalletPresenter;
