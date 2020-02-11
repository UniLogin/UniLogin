export interface ProviderConfig {
  backendUrl: string;
}

export const DEFAULT_CONFIG: ProviderConfig = {
  backendUrl: 'http://localhost:8080', // 'https://universal-provider-backend.netlify.com',
};
