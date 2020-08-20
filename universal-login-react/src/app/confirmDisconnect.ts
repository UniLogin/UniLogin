import {WalletService} from '@unilogin/sdk';

export const confirmDisconnect = (walletService: WalletService, action: Function) => {
  if (confirm('Are you sure you want to leave? You will lose access to this account.')) {
    walletService.disconnect();
    action();
  }
};
