import {MetamaskEthereum} from '../models/metamask';
import {State} from 'reactive-properties';

export class MetamaskService {
  metamaskProvider = new State<MetamaskEthereum | undefined>(undefined);

  async tryEnablingMetamask(): Promise<string | undefined> {
    if (!!window.ethereum) {
      try {
        await window.ethereum.enable();

        setTimeout(() => this.metamaskProvider.set(window.ethereum), 2000);
        return window.ethereum.selectedAddress;
      } catch (error) {
      }
    }
  }
}
