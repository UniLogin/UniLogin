import {BrowserWeb3Provider} from '../lib/models/BrowserWeb3Provider';

declare global {
  const ethereum: BrowserWeb3Provider | undefined;

  interface Window {
    ethereum: BrowserWeb3Provider | undefined;
  }
}
