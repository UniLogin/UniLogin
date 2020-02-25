export interface ProviderConfig {
  backendUrl: string;
  logoUrl: string;
  ulButtonId: string;
}

export const DEFAULT_CONFIG: ProviderConfig = {
  backendUrl: 'http://localhost:8080', // 'https://universal-provider-backend.netlify.com',
  logoUrl: 'https://universalloginsdk.readthedocs.io/en/latest/_images/logo.png',
  ulButtonId: 'unilogin-button',
};
