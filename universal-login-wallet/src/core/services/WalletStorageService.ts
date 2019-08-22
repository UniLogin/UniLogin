import {StorageEntry, StorageService} from './StorageService';
import {WalletService} from '@universal-login/sdk';
import {ApplicationWallet, ensure} from '@universal-login/commons';
import {asObject, asString, Sanitizer} from '@restless/sanitizers';

export class WalletStorageService {
  private storage: StorageEntry<ApplicationWallet>;

  constructor(
    private walletService: WalletService,
    storageService: StorageService,
  ) {
    this.storage = new StorageEntry(
      'wallet',
      asApplicationWallet,
      storageService,
    );
  }

  save() {
    ensure(this.walletService.isAuthorized(), Error, 'User must be authorized');
    const wallet = this.walletService.applicationWallet as ApplicationWallet;
    this.storage.set(wallet);
  }

  load() {
    const wallet = this.storage.get();
    if (wallet === null) {
      return false;
    }
    this.walletService.connect(wallet);
    return true;
  }
}

const asApplicationWallet: Sanitizer<ApplicationWallet> = asObject({
  name: asString,
  contractAddress: asString,
  privateKey: asString,
});
