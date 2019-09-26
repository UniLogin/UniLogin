import {WalletService} from '@universal-login/sdk';

export class WalletPresenter {
  constructor(
    private walletService: WalletService
  ) {}

  getPrivateKey() {
    switch (this.walletService.state.kind) {
      case 'Connecting':
      case 'Deployed':
        return this.walletService.state.wallet.privateKey;
      default:
        throw new Error('Invalid wallet state: expected Deployed or Connecting wallet');
    }
  }

  getName(): string {
    switch (this.walletService.state.kind) {
      case 'Connecting':
      case 'Deployed':
        return this.walletService.state.wallet.name;
      default:
        throw new Error('Invalid wallet state: expected Deployed or Connecting wallet');
    }
  }

  getContractAddress(): string {
    switch (this.walletService.state.kind) {
      case 'Connecting':
      case 'Deployed':
      case 'Future':
        return this.walletService.state.wallet.contractAddress;
      default:
        throw new Error('Invalid wallet state: expected Deployed, Connecting or Future wallet');
    }
  }
}

export default WalletPresenter;
