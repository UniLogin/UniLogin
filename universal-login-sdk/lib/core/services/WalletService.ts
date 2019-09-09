import {ensure, ApplicationWallet, walletFromBrain} from '@universal-login/commons';
import UniversalLoginSDK from '../../api/sdk';
import {FutureWallet} from '../../api/FutureWalletFactory';
import {WalletOverridden, FutureWalletNotSet, InvalidPassphrase} from '../utils/errors';
import {Wallet} from 'ethers';
import {DeployedWallet} from '../..';

type WalletState = {
  kind: 'None'
} | {
  kind: 'Future'
  futureWallet: FutureWallet
} | {
  kind: 'Deployed'
  deployedWallet: DeployedWallet
};

type WalletFromBackupCodes = (username: string, password: string) => Promise<Wallet>;

export interface WalletStorage {
  load(): ApplicationWallet | null;
  save(wallet: ApplicationWallet | null): void;
  remove(): void;
}

export class WalletService {
  public state: WalletState = {kind: 'None'};

  constructor(private sdk: UniversalLoginSDK, private walletFromPassphrase: WalletFromBackupCodes = walletFromBrain, private storage?: WalletStorage) {}

  walletDeployed(): boolean {
    return this.state.kind === 'Deployed';
  }

  isAuthorized(): boolean {
    return this.walletDeployed();
  }

  async createFutureWallet(): Promise<FutureWallet> {
    const futureWallet = await this.sdk.createFutureWallet();
    this.setFutureWallet(futureWallet);
    return futureWallet;
  }

  setFutureWallet(futureWallet: FutureWallet) {
    if (this.state.kind !== 'None') {
      throw new WalletOverridden();
    }
    this.state = {kind: 'Future', futureWallet};
  }

  setDeployed(name: string) {
    if (this.state.kind !== 'Future') {
      throw new FutureWalletNotSet();
    }
    const {contractAddress, privateKey} = this.state.futureWallet;
    const deployedWallet = new DeployedWallet(contractAddress, name, privateKey, this.sdk);
    this.state = {kind: 'Deployed', deployedWallet};
    this.storage && this.storage.save(deployedWallet.asApplicationWallet);
  }

  connect(deployedWallet: DeployedWallet) {
    if (this.state.kind !== 'None') {
      throw new WalletOverridden();
    }
    this.state = {kind: 'Deployed', deployedWallet};
    this.storage && this.storage.save(deployedWallet.asApplicationWallet);
  }

  async recover(name: string, passphrase: string) {
    const contractAddress = await this.sdk.getWalletContractAddress(name);
    const wallet = await this.walletFromPassphrase(name, passphrase);
    ensure(await this.sdk.keyExist(contractAddress, wallet.address), InvalidPassphrase);
    this.connect(new DeployedWallet(contractAddress, name, wallet.privateKey, this.sdk));
  }

  disconnect(): void {
    this.state = {kind: 'None'};
    this.storage && this.storage.remove();
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
      deployedWallet: new DeployedWallet(wallet.contractAddress, name, wallet.privateKey, this.sdk),
    };
  }
}
