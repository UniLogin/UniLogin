import {BlockNumberState} from '../states/BlockNumberState';
import {Callback} from 'reactive-properties/dist/Property';
import {IStorageService} from '../models/IStorageService';
import {StorageEntry} from './StorageEntry';
import {asNumber} from '@restless/sanitizers';
import {MemoryStorageService} from './MemoryStorageService';

const STORAGE_KEY = 'LAST_BLOCK_NUMBER';

export class BlockNumberService {
  storage: StorageEntry<number>;

  constructor(
    private blockNumberState: BlockNumberState,
    storageService: IStorageService = new MemoryStorageService(),
  ) {
    this.storage = new StorageEntry(STORAGE_KEY, asNumber, storageService);
  }

  get() {
    return this.blockNumberState.get();
  }

  set(blockNumber: number) {
    this.blockNumberState.set(blockNumber);
  }

  subscribe(callback: Callback) {
    return this.blockNumberState.subscribe(callback);
  }
}
