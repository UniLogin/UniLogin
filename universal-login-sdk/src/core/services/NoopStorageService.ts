import {IStorageService} from '../models/IStorageService';

export class NoopStorageService implements IStorageService {
  get() {
    return null;
  }

  remove() {

  }

  set() {
  }
}
