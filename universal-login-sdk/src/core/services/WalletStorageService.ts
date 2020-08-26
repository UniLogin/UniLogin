import {providers} from 'ethers';
import {asAnyOf, asObject, asString, cast, asExactly, asOptional} from '@restless/sanitizers';
import {ApplicationWallet, SerializableFutureWallet, Network, ProviderService, asSerializableConfirmedWallet, asSerializableRequestedCreatingWallet, asSerializableRequestedRestoringWallet, asSerializableRestoringWallet} from '@unilogin/commons';
import {WalletStorage, SerializedWalletState, SerializedDeployingWallet, SerializedDeployedWallet} from '../models/WalletService';
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
    try {
      const data = this.storageService.get(DEPRECATED_STORAGE_KEY);
      if (data === null) return;
      const {wallet} = cast(JSON.parse(data), asObject({
        kind: asExactly('Deployed'),
        wallet: asSerializedDeployedWallet,
      }));
      for (const network of ['mainnet', 'kovan', 'rinkeby', 'ropsten']) {
        const providerService = new ProviderService(getProviderForNetwork(network));
        if (await providerService.isContract(wallet.contractAddress)) {
          this.storageService.remove(DEPRECATED_STORAGE_KEY);
          this.storageService.set(`${DEPRECATED_STORAGE_KEY}-${network}`, data);
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
  email: asOptional(asString),
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
], 'wallet state');

function getProviderForNetwork(key: string) {
  const network = key === 'mainnet' ? 'homestead' : key;
  return new providers.InfuraProvider(network);
};
