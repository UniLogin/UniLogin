import {Provider} from 'web3/providers';

export interface Web3ProviderFactory {
  icon: string;
  name: string;
  create: () => Provider | Promise<Provider>;
}
