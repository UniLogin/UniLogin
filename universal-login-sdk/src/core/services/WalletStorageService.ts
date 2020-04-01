import {providers} from 'ethers';
import {asAnyOf, asObject, asString, cast} from '@restless/sanitizers';
import {ApplicationWallet, asExactly, SerializableFutureWallet} from '@unilogin/commons';
import {WalletStorage, SerializedWalletState, SerializedDeployingWallet} from '../models/WalletService';
import {IStorageService} from '../models/IStorageService';
import {StorageEntry} from './StorageEntry';
import {BlockchainService} from '@unilogin/contracts';

const DEPRECATED_STORAGE_KEY = 'wallet';

export class WalletStorageService implements WalletStorage {
  private storage: StorageEntry<SerializedWalletState>;
  private readonly STORAGE_KEY: string;

  constructor(private storageService: IStorageService, chainName: string) {
    this.STORAGE_KEY = `${DEPRECATED_STORAGE_KEY}-${chainName}`;
    this.storage = new StorageEntry(
      this.STORAGE_KEY,
      asSerializedState,
      storageService,
    );
  }

  async migrate() {
    try {
      const data = this.storageService.get(DEPRECATED_STORAGE_KEY);
      if (data === null) return;
      const {wallet} = cast(JSON.parse(data), asObject({
        kind: asExactly('Deployed'),
        wallet: asApplicationWallet,
      }));
      for (const key of ['mainnet', 'kovan', 'rinkeby', 'ropsten']) {
        const blockchainService = new BlockchainService(getProviderByKey(key));
        if (await blockchainService.isContract(wallet.contractAddress)) {
          this.storageService.remove(DEPRECATED_STORAGE_KEY);
          this.storageService.set(`${DEPRECATED_STORAGE_KEY}-${key}`, data);
          return;
        }
      }
    } catch {}
  }

  load(): SerializedWalletState {
    return this.storage.get() || {kind: 'None'};
  }

  save(state: SerializedWalletState): void {
    this.storage.set(state);
  }
}

const asSerializableFutureWallet = asObject<SerializableFutureWallet>({
  contractAddress: asString,
  privateKey: asString,
  gasPrice: asString,
  ensName: asString,
  gasToken: asString,
});

const asApplicationWallet = asObject<ApplicationWallet>({
  name: asString,
  contractAddress: asString,
  privateKey: asString,
});

const asSerializedDeployingWallet = asObject<SerializedDeployingWallet>({
  deploymentHash: asString,
  name: asString,
  contractAddress: asString,
  privateKey: asString,
});

const asSerializedState = asAnyOf([
  asObject<SerializedWalletState>({
    kind: asExactly('None'),
  }),
  asObject<SerializedWalletState>({
    kind: asExactly('Future'),
    name: asString,
    wallet: asSerializableFutureWallet,
  }),
  asObject<SerializedWalletState>({
    kind: asExactly('Deploying'),
    wallet: asSerializedDeployingWallet,
  }),
  asObject<SerializedWalletState>({
    kind: asExactly('Connecting'),
    wallet: asApplicationWallet,
  }),
  asObject<SerializedWalletState>({
    kind: asExactly('Deployed'),
    wallet: asApplicationWallet,
  }),
], 'wallet state');

function getProviderByKey(key: string) {
  const network = key === 'mainnet' ? 'homestead' : key;
  return new providers.InfuraProvider(network);
};
