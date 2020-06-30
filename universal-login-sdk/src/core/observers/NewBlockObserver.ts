import {ProviderService, Nullable, ensureNotNullish} from '@unilogin/commons';
import {BlockNumberState} from '../states/BlockNumberState';
import {MemoryStorageService, IStorageService, StorageEntry} from '../..';
import {asNumber} from '@restless/sanitizers';
import {InvalidObserverState, MissingParameter} from '../utils/errors';
import {Callback} from 'reactive-properties';

const STORAGE_KEY = 'LAST_BLOCK_NUMBER';

type NewBlockCallback = (blockNumber: number) => void;

export class NewBlockObserver {
  private unsubscribe: Nullable<(Callback)> = null;
  private blockNumberStorage: StorageEntry<number>;
  private callbacks: NewBlockCallback[] = [];

  constructor(
    private providerService: ProviderService,
    private currentBlock: BlockNumberState,
    storageService: IStorageService = new MemoryStorageService(),
  ) {
    this.blockNumberStorage = new StorageEntry(STORAGE_KEY, asNumber, storageService);
  }

  getStorageBlockNumber() {
    const storageBlockNumber = this.blockNumberStorage.get();
    ensureNotNullish(storageBlockNumber, MissingParameter, 'storageBlockNumber');
    return storageBlockNumber;
  }

  async start() {
    this.currentBlock.set(await this.providerService.getBlockNumber());
    this.unsubscribe = this.currentBlock.subscribe(() => this.callCallbacks());
    if (!this.blockNumberStorage.get()) {
      this.blockNumberStorage.set(this.currentBlock.get());
    }
  }

  callCallbacks() {
    const currentBlockNumber = this.currentBlock.get();
    const storageBlockNumber = this.getStorageBlockNumber();
    ensureNotNullish(currentBlockNumber, InvalidObserverState);
    if (currentBlockNumber === storageBlockNumber) {
      return;
    }
    this.blockNumberStorage.set(currentBlockNumber);
    for (const callback of this.callbacks) {
      callback(currentBlockNumber);
    }
  }

  async subscribe(callback: NewBlockCallback) {
    if (!this.unsubscribe) await this.start();
    callback(this.currentBlock.get());
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) this.stop();
    };
  }

  stop() {
    ensureNotNullish(this.unsubscribe, InvalidObserverState);
    this.unsubscribe();
    this.unsubscribe = null;
  }
}
