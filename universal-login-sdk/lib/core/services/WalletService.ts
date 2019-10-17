import {ensure, ApplicationWallet, walletFromBrain, Procedure, Message} from '@universal-login/commons';
import UniversalLoginSDK from '../../api/sdk';
import {FutureWallet} from '../../api/FutureWalletFactory';
import {WalletOverridden, FutureWalletNotSet, InvalidPassphrase} from '../utils/errors';
import {Wallet, utils} from 'ethers';
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
  kind: 'Deploying'
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

  async deployFutureWallet(ensName: string, gasPrice: string, gasToken: string, onTransactionHash?: (txHash: string) => void) {
    if (this.state.kind !== 'Future') {
      throw new Error('Invalid state: expected future wallet');
    }
    const {deploy, contractAddress, privateKey} = this.state.wallet;

    const applicationWallet = {contractAddress, name: ensName, privateKey};
    this.stateProperty.set({kind: 'Deploying', wallet: applicationWallet});

    const {waitToBeSuccess, waitForTransactionHash} = await deploy(ensName, gasPrice, gasToken);
    const {transactionHash} = await waitForTransactionHash();
    onTransactionHash !== undefined && onTransactionHash(transactionHash!);
    const deployedWallet = await waitToBeSuccess();
    this.stateProperty.set({kind: 'Deployed', wallet: deployedWallet});
    this.storage && this.storage.save(deployedWallet.asApplicationWallet);
    return deployedWallet;
  }

  setFutureWallet(wallet: FutureWallet) {
    if (this.state.kind !== 'None') {
      throw new WalletOverridden();
    }
    this.stateProperty.set({kind: 'Future', wallet});
  }

  setDeployed(name: string) {
    if (this.state.kind !== 'Future') {
      throw new FutureWalletNotSet();
    }
    const {contractAddress, privateKey} = this.state.wallet;
    const wallet = new DeployedWallet(contractAddress, name, privateKey, this.sdk);
    this.stateProperty.set({kind: 'Deployed', wallet});
    this.storage && this.storage.save(wallet.asApplicationWallet);
  }

  setConnecting(wallet: ApplicationWallet) {
    if (this.state.kind !== 'None') {
      throw new WalletOverridden();
    }
    this.stateProperty.set({kind: 'Connecting', wallet});
  }

  setWallet(wallet: ApplicationWallet) {
    if (this.state.kind !== 'None' && this.state.kind !== 'Connecting') {
      throw new WalletOverridden();
    }
    this.stateProperty.set({
      kind: 'Deployed',
      wallet: new DeployedWallet(wallet.contractAddress, wallet.name, wallet.privateKey, this.sdk)
    });
    this.storage && this.storage.save(wallet);
  }

  async recover(name: string, passphrase: string) {
    const contractAddress = await this.sdk.getWalletContractAddress(name);
    const wallet = await this.walletFromPassphrase(name, passphrase);
    ensure(await this.sdk.keyExist(contractAddress, wallet.address), InvalidPassphrase);
    const applicationWallet: ApplicationWallet = {contractAddress, name, privateKey: wallet.privateKey};
    this.setWallet(applicationWallet);
  }

  async connect(name: string, callback: Procedure) {
    const contractAddress = await this.sdk.getWalletContractAddress(name);
    const {privateKey, securityCode} = await this.sdk.connect(contractAddress);

    const applicationWallet: ApplicationWallet = {privateKey, contractAddress, name};
    this.setConnecting(applicationWallet);

    const filter = {
      contractAddress,
      key: utils.computeAddress(privateKey)
    };

    const subscription = this.sdk.subscribe('KeyAdded', filter, () => {
      this.setWallet(applicationWallet);
      subscription.remove();
      callback();
    });

    return {
      unsubscribe: () => subscription.remove(),
      securityCode
    };
  }

  async removeWallet(transactionDetails: Partial<Message>) {
    if (this.state.kind === 'Deployed') {
      await this.state.wallet.removeOwnKey(transactionDetails);
    }
    this.disconnect();
  }

  disconnect(): void {
    this.stateProperty.set({kind: 'None'});
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
    this.stateProperty.set({
      kind: 'Deployed',
      wallet: new DeployedWallet(wallet.contractAddress, wallet.name, wallet.privateKey, this.sdk),
    });
  }

  removeFromStorage() {
    this.storage && this.storage.remove();
  }
}
