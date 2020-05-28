export interface ProviderConfig {
  backendUrl: string;
  logoUrl: string;
  ulButtonId: string;
  showTransferDialogs: boolean;
}

const IS_DEV = false;
const showTransferDialogs = false;

export const DEFAULT_CONFIG: ProviderConfig = {
  backendUrl: IS_DEV ? 'http://localhost:8080' : 'https://universal-provider-backend.netlify.com',
  logoUrl: 'https://universalloginsdk.readthedocs.io/en/latest/_images/logo.png',
  ulButtonId: 'unilogin-button',
  showTransferDialogs,
};
