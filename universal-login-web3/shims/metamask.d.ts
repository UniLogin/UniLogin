import {MetamaskEthereum} from '../lib/models/metamask';

declare global {
  const ethereum: MetamaskEthereum | undefined;

  interface Window {
    ethereum: MetamaskEthereum | undefined;
  }
}
