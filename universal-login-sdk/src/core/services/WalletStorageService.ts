import {asAnyOf, asObject, asString, cast, asExactly, asOptional} from '@restless/sanitizers';
import {ApplicationWallet, SerializableFutureWallet, Network, asSerializableConfirmedWallet, asSerializableRequestedCreatingWallet, asSerializableRequestedRestoringWallet, asSerializableRestoringWallet, asSerializableRequestedMigratingWallet, asSerializableConfirmedMigratingWallet} from '@unilogin/commons';
import {WalletStorage, SerializedWalletState, SerializedDeployingWallet, SerializedDeployedWallet, SerializedDeployedWithoutEmailWallet} from '../models/WalletService';
import {IStorageService} from '../models/IStorageService';
import {StorageEntry} from './StorageEntry';

const DEPRECATED_STORAGE_KEY = 'wallet';

export class WalletStorageService implements WalletStorage {
  private storage: StorageEntry<SerializedWalletState>;
  private readonly STORAGE_KEY: string;

  constructor(private storageService: IStorageService, chainName: Network) {
    const alphabeticNetwork = Network.toAlphabetic(chainName);
    this.STORAGE_KEY = `${DEPRECATED_STORAGE_KEY}-${alphabeticNetwork}`;
    this.storage = new StorageEntry(
      this.STORAGE_KEY,
      asSerializedState,
      storageService,
    );
  }

  async migrate() {
    for (const network of ['mainnet', 'kovan', 'rinkeby', 'ropsten', 'ganache']) {
      try {
        const data = this.storageService.get(`${DEPRECATED_STORAGE_KEY}-${network}`);
        if (data === null) continue;
        const state = cast(JSON.parse(data), asObject({
          kind: asExactly('Deployed'),
          wallet: asObject({
            name: asString,
            contractAddress: asString,
            privateKey: asString,
            email: asOptional(asString),
          }),
        }));
        if (!state.wallet.email) {
          this.storageService.set(`${DEPRECATED_STORAGE_KEY}-${network}`, JSON.stringify({...state, kind: 'DeployedWithoutEmail'}));
        }
      } catch {}
    }
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
  email: asOptional(asString),
});

const asApplicationWallet = asObject<ApplicationWallet>({
  name: asString,
  contractAddress: asString,
  privateKey: asString,
});

const asSerializedDeployedWallet = asObject<SerializedDeployedWallet>({
  name: asString,
  contractAddress: asString,
  privateKey: asString,
  email: asString,
});

const asSerializedDeployedWithoutEmailWallet = asObject<SerializedDeployedWithoutEmailWallet>({
  name: asString,
  contractAddress: asString,
  privateKey: asString,
});

const asSerializedDeployingWallet = asObject<SerializedDeployingWallet>({
  deploymentHash: asString,
  name: asString,
  contractAddress: asString,
  privateKey: asString,
  email: asOptional(asString),
});

const asSerializedState = asAnyOf([
  asObject<SerializedWalletState>({
    kind: asExactly('None'),
  }),
  asObject<SerializedWalletState>({
    kind: asExactly('RequestedCreating'),
    wallet: asSerializableRequestedCreatingWallet,
  }),
  asObject<SerializedWalletState>({
    kind: asExactly('RequestedRestoring'),
    wallet: asSerializableRequestedRestoringWallet,
  }),
  asObject<SerializedWalletState>({
    kind: asExactly('Confirmed'),
    wallet: asSerializableConfirmedWallet,
  }),
  asObject<SerializedWalletState>({
    kind: asExactly('Restoring'),
    wallet: asSerializableRestoringWallet,
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
    wallet: asSerializedDeployedWallet,
  }),
  asObject<SerializedWalletState>({
    kind: asExactly('DeployedWithoutEmail'),
    wallet: asSerializedDeployedWithoutEmailWallet,
  }),
  asObject<SerializedWalletState>({
    kind: asExactly('RequestedMigrating'),
    wallet: asSerializableRequestedMigratingWallet,
  }),
  asObject<SerializedWalletState>({
    kind: asExactly('ConfirmedMigrating'),
    wallet: asSerializableConfirmedMigratingWallet,
  }),
], 'wallet state');
