import {ensure, ApplicationWallet, walletFromBrain} from '@universal-login/commons';
import UniversalLoginSDK from '../../api/sdk';
import {FutureWallet} from '../../api/FutureWalletFactory';
import {WalletOverridden, FutureWalletNotSet, InvalidPassphrase} from '../utils/errors';
import {Wallet} from 'ethers';

type WalletState = 'None' | 'Future' | 'Deployed';

type WalletFromBackupCodes = (username: string, password: string) => Promise<Wallet>;

export interface WalletStorage {
  load(): ApplicationWallet | null;
  save(wallet: ApplicationWallet | null): void;
  remove(): void;
}

export class WalletService {
  public applicationWallet?: FutureWallet | ApplicationWallet;
  public state: WalletState = 'None';

  constructor(private sdk: UniversalLoginSDK, private walletFromPassphrase: WalletFromBackupCodes = walletFromBrain, private storage?: WalletStorage) {}

  walletDeployed(): boolean {
    return this.state === 'Deployed';
  }

  isAuthorized(): boolean {
    return this.walletDeployed();
  }

  async createFutureWallet(): Promise<FutureWallet> {
    const futureWallet = await this.sdk.createFutureWallet();
    this.setFutureWallet(futureWallet);
    return futureWallet;
  }

  setFutureWallet(applicationWallet: FutureWallet) {
    ensure(this.state === 'None', WalletOverridden);
    this.state = 'Future';
    this.applicationWallet = applicationWallet;
  }

  setDeployed(name: string) {
    ensure(this.state === 'Future', FutureWalletNotSet);
    const {contractAddress, privateKey} = this.applicationWallet!;
    this.state = 'Deployed';
    this.applicationWallet = {name, contractAddress, privateKey};
    this.saveToStorage(this.applicationWallet);
  }

  connect(applicationWallet: ApplicationWallet) {
    ensure(this.state === 'None', WalletOverridden);
    this.state = 'Deployed';
    this.setApplicationWallet(applicationWallet);
    this.saveToStorage(applicationWallet);
  }

  setApplicationWallet(applicationWallet: ApplicationWallet) {
    this.applicationWallet = applicationWallet;
  }

  async recover(name: string, passphrase: string) {
    const contractAddress = await this.sdk.getWalletContractAddress(name);
    const wallet = await this.walletFromPassphrase(name, passphrase);
    ensure(await this.sdk.keyExist(contractAddress, wallet.address), InvalidPassphrase);
    const applicationWallet: ApplicationWallet = {name, privateKey: wallet.privateKey, contractAddress};
    this.connect(applicationWallet);
  }

  disconnect(): void {
    this.state = 'None';
    this.applicationWallet = undefined;
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
    ensure(this.state === 'None', WalletOverridden);
    this.state = 'Deployed';
    this.applicationWallet = wallet;
  }

  removeFromStorage() {
    this.storage && this.storage.remove();
  }
}
