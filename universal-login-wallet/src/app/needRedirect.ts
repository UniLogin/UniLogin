import {WalletState} from '@universal-login/sdk';
import {urlMapping} from './constants/urlMapping';

export const needRedirect = (walletState: WalletState, currentLocation: string | string[]) =>
  urlMapping[walletState.kind as 'None'].filter(path => currentLocation.includes(path)).length === 0;
