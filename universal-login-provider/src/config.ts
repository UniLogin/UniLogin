export interface ProviderConfig {
  backendUrl: string;
  logoUrl: string;
}

export const DEFAULT_CONFIG: ProviderConfig = {
  backendUrl: 'https://universal-provider-backend.netlify.com',
  logoUrl: 'https://universalloginsdk.readthedocs.io/en/latest/_images/logo.png',
};
