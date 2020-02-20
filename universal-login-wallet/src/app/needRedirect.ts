import {WalletState} from '@unilogin/sdk';
import {urlMapping} from './constants/urlMapping';

export const needRedirect = (walletState: WalletState, currentLocation: string | string[]) =>
  urlMapping[walletState.kind].filter(path => currentLocation.includes(path)).length === 0;
