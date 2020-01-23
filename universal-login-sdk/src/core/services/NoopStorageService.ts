import {IStorageService} from '../models/WalletService';

export class NoopStorageService implements IStorageService {
  get() {
    return '{kind: "None"}';
  }

  remove() {

  }

  set() {
  }
}
