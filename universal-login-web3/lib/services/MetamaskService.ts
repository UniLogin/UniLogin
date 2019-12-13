import {BrowserWeb3Provider} from '../models/BrowserWeb3Provider';
import {State} from 'reactive-properties';

export class MetamaskService {
  metamaskProvider = new State<BrowserWeb3Provider | undefined>(undefined);

  async tryEnablingMetamask(): Promise<string | undefined> {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();

        setTimeout(() => this.metamaskProvider.set(window.ethereum), 2000);
        return window.ethereum.selectedAddress;
      } catch (error) {
      }
    }
  }
}
