import {SerializedWalletState, WalletStorage} from '../..';

export class NoopWalletStorage implements WalletStorage {
  load(): SerializedWalletState {
    return {kind: 'None'};
  }

  save() {
  }
}
