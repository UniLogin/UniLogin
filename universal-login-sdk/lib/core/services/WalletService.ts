import {ensure, ApplicationWallet, walletFromBrain} from '@universal-login/commons';
import UniversalLoginSDK from '../../api/sdk';
import {FutureWallet} from '../../api/FutureWalletFactory';
import {WalletOverridden, FutureWalletNotSet, InvalidPassphrase} from '../utils/errors';
import {Wallet} from 'ethers';
import {DeployedWallet} from '../..';
import {State, map} from 'reactive-properties';

type WalletState = {
  kind: 'None'
} | {
  kind: 'Future'
  wallet: FutureWallet
} | {
  kind: 'Connecting'
  wallet: ApplicationWallet
} | {
  kind: 'Deployed'
  wallet: DeployedWallet
};

type WalletFromBackupCodes = (username: string, password: string) => Promise<Wallet>;

export interface WalletStorage {
  load(): ApplicationWallet | null;
  save(wallet: ApplicationWallet | null): void;
  remove(): void;
}

export class WalletService {
  public stateProperty = new State<WalletState>({kind: 'None'});

  public walletDeployed = this.stateProperty.pipe(map((state) => state.kind === 'Deployed'));
  public isAuthorized = this.walletDeployed;

  get state() {
    return this.stateProperty.get();
  }

  // Should only be used for testing.
  // Use other state-transition methods defined bellow
  set state(value: WalletState) {
    this.stateProperty.set(value);
  }

  constructor(private sdk: UniversalLoginSDK, private walletFromPassphrase: WalletFromBackupCodes = walletFromBrain, private storage?: WalletStorage) {}

  getDeployedWallet(): DeployedWallet {
    if (this.state.kind !== 'Deployed') {
      throw new Error('Invalid state: expected deployed wallet');
    }
    return this.state.wallet;
  }

  getConnectingWallet(): ApplicationWallet {
    if (this.state.kind !== 'Connecting') {
      throw new Error('Invalid state: expected connecting wallet');
    }
    return this.state.wallet;
  }

  async createFutureWallet(): Promise<FutureWallet> {
    const futureWallet = await this.sdk.createFutureWallet();
    this.setFutureWallet(futureWallet);
    return futureWallet;
  }

  setFutureWallet(wallet: FutureWallet) {
    if (this.state.kind !== 'None') {
      throw new WalletOverridden();
    }
    this.state = {kind: 'Future', wallet};
  }

  setDeployed(name: string) {
    if (this.state.kind !== 'Future') {
      throw new FutureWalletNotSet();
    }
    const {contractAddress, privateKey} = this.state.wallet;
    const wallet = new DeployedWallet(contractAddress, name, privateKey, this.sdk);
    this.state = {kind: 'Deployed', wallet};
    this.storage && this.storage.save(wallet.asApplicationWallet);
  }

  setConnecting(wallet: ApplicationWallet) {
    if (this.state.kind !== 'None') {
      throw new WalletOverridden();
    }
    this.state = {kind: 'Connecting', wallet};
  }

  connect(wallet: ApplicationWallet) {
    if (this.state.kind !== 'None' && this.state.kind !== 'Connecting') {
      throw new WalletOverridden();
    }
    this.state = {kind: 'Deployed', wallet: new DeployedWallet(wallet.contractAddress, wallet.name, wallet.privateKey, this.sdk)};
    this.storage && this.storage.save(wallet);
  }

  async recover(name: string, passphrase: string) {
    const contractAddress = await this.sdk.getWalletContractAddress(name);
    const wallet = await this.walletFromPassphrase(name, passphrase);
    ensure(await this.sdk.keyExist(contractAddress, wallet.address), InvalidPassphrase);
    this.connect(new DeployedWallet(contractAddress, name, wallet.privateKey, this.sdk));
  }

  disconnect(): void {
    this.state = {kind: 'None'};
    this.removeFromStorage();
  }

  saveToStorage(applicationWallet: ApplicationWallet) {
    this.storage && this.storage.save(applicationWallet);
  }

  loadFromStorage() {
    if (!this.storage) {
      return;
    }
    const wallet = this.storage.load();
    if (!wallet) {
      return;
    }
    ensure(this.state.kind === 'None', WalletOverridden);
    this.state = {
      kind: 'Deployed',
      wallet: new DeployedWallet(wallet.contractAddress, wallet.name, wallet.privateKey, this.sdk),
    };
  }

  removeFromStorage() {
    this.storage && this.storage.remove();
  }
}
