import {WalletService} from '@unilogin/sdk';

export class WalletPresenter {
  constructor(
    private walletService: WalletService,
  ) {}

  getPrivateKey() {
    switch (this.walletService.state.kind) {
      case 'Connecting':
      case 'Deployed':
      case 'DeployedWithoutEmail':
      case 'RequestedMigrating':
      case 'ConfirmedMigrating':
        return this.walletService.state.wallet.privateKey;
      default:
        throw new Error('Invalid wallet state: expected Migrating, Deployed or Connecting wallet');
    }
  }

  getName(): string {
    switch (this.walletService.state.kind) {
      case 'Connecting':
      case 'Deployed':
      case 'DeployedWithoutEmail':
      case 'RequestedMigrating':
      case 'ConfirmedMigrating':
        return this.walletService.state.wallet.name;
      default:
        throw new Error('Invalid wallet state: expected Deployed, Migrating, or Connecting wallet');
    }
  }

  getContractAddress(): string {
    switch (this.walletService.state.kind) {
      case 'Connecting':
      case 'DeployedWithoutEmail':
      case 'Deployed':
      case 'Future':
      case 'RequestedMigrating':
      case 'ConfirmedMigrating':
        return this.walletService.state.wallet.contractAddress;
      default:
        throw new Error('Invalid wallet state: expected Deployed, DeployedWithoutEmail, Migrating, Connecting or Future wallet');
    }
  }
}

export default WalletPresenter;
