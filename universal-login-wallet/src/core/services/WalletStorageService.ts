import {StorageEntry, StorageService} from './StorageService';
import {ApplicationWallet} from '@universal-login/commons';
import {asObject, asString, Sanitizer} from '@restless/sanitizers';
import {WalletStorage} from '@universal-login/sdk';

export class WalletStorageService implements WalletStorage {
  private storage: StorageEntry<ApplicationWallet | null>;

  constructor(storageService: StorageService) {
    this.storage = new StorageEntry(
      'wallet',
      asApplicationWallet,
      storageService,
    );
  }

  load(): ApplicationWallet | null {
    return this.storage.get();
  }

  save(wallet: ApplicationWallet): void {
    this.storage.set(wallet);
  }

  remove() {
    this.storage.remove();
  }
}

const asApplicationWallet: Sanitizer<ApplicationWallet> = asObject({
  name: asString,
  contractAddress: asString,
  privateKey: asString,
});
