import {Dialogs} from './models/provider';

export interface ProviderConfig {
  backendUrl: string;
  logoUrl: string;
  ulButtonId: string;
  disabledDialogs: Array<Dialogs>;
}

const IS_DEV = false;

export const DEFAULT_CONFIG: ProviderConfig = {
  backendUrl: IS_DEV ? 'http://localhost:8080' : 'https://universal-provider-backend.netlify.com',
  logoUrl: 'https://universalloginsdk.readthedocs.io/en/latest/_images/logo.png',
  ulButtonId: 'unilogin-button',
  disabledDialogs: [Dialogs.WAITING_FOR_TRANSACTION, Dialogs.ERRORS],
};
