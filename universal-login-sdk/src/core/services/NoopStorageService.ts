import {IStorageService} from '../models/IStorageService';

export class NoopStorageService implements IStorageService {
  get() {
    return '{kind: "None"}';
  }

  remove() {

  }

  set() {
  }
}
