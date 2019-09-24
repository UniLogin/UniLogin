import {MetamaskEthereum} from '../models/metamask';
import {State} from 'reactive-properties';

export class MetamaskService {
  metamaskProvider = new State<MetamaskEthereum | undefined>(undefined);

  async tryEnablingMetamask(): Promise<string | undefined> {
    if (!!window.ethereum) {
      try {
        await ethereum!.enable();

        this.metamaskProvider.set(ethereum!);
        return ethereum!.selectedAddress;
      } catch (error) {
      }
    }
  }
}
