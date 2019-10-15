import {WalletService} from '@universal-login/sdk';
import {RouterProps} from 'react-router';

export const disconnectFromWallet = (walletService: WalletService, router: RouterProps) => {
  walletService.disconnect();
  router.history.push('/welcome');
};
