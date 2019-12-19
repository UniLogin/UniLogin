import {BrowserWeb3Provider} from '../src/models/BrowserWeb3Provider';
import {Provider} from 'web3/providers';

declare global {
  const ethereum: BrowserWeb3Provider | undefined;

  interface Window {
    ethereum: BrowserWeb3Provider | undefined;
    web3?: {
      currentProvider: Provider;
    }
  }
}
