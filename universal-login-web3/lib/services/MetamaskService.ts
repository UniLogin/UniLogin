import {State} from 'reactive-properties';
import {Nullable} from '@universal-login/commons';
import {BrowserWeb3Provider} from '../models/BrowserWeb3Provider';

export class MetamaskService {
  metamaskProvider = new State<Nullable<BrowserWeb3Provider>>(null);

  async tryEnablingMetamask(): Promise<string | undefined> {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();

        setTimeout(() => this.metamaskProvider.set(window.ethereum || null), 2000);
        return window.ethereum.selectedAddress;
      } catch (error) {
      }
    }
  }
}
