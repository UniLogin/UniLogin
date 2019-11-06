import {WalletStorage} from '../..';

export class NoopWalletStorage implements WalletStorage {
  load() {
    return null;
  }

  remove() {
  }

  save() {
  }
}
