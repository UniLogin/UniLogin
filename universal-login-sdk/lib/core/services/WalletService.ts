import {ensure, ApplicationWallet, walletFromBrain, Procedure, ExecutionOptions, GasParameters, INITIAL_GAS_PARAMETERS, ensureNotNull} from '@universal-login/commons';
import UniversalLoginSDK from '../../api/sdk';
import {FutureWallet, DeployingWallet} from '../../api/FutureWalletFactory';
import {InvalidWalletState, InvalidPassphrase, WalletOverridden, TransactionHashNotFound} from '../utils/errors';
import {utils, Wallet} from 'ethers';
import {DeployedWallet, WalletStorage} from '../..';
import {map, State} from 'reactive-properties';
import {WalletState} from '../models/WalletService';
import {WalletSerializer} from './WalletSerializer';
import {NoopWalletStorage} from './NoopWalletStorage';
import {ConnectingWallet} from '../../api/DeployedWallet';

type WalletFromBackupCodes = (username: string, password: string) => Promise<Wallet>;

export class WalletService {
  private readonly walletSerializer: WalletSerializer;

  private gasParameters: GasParameters = INITIAL_GAS_PARAMETERS;

  stateProperty = new State<WalletState>({kind: 'None'});

  walletDeployed = this.stateProperty.pipe(map((state) => state.kind === 'Deployed'));
  isAuthorized = this.walletDeployed;

  get state() {
    return this.stateProperty.get();
  }

  constructor(
    public readonly sdk: UniversalLoginSDK,
    private readonly walletFromPassphrase: WalletFromBackupCodes = walletFromBrain,
    private readonly storage: WalletStorage = new NoopWalletStorage(),
  ) {
    this.walletSerializer = new WalletSerializer(sdk);
  }

  getDeployedWallet(): DeployedWallet {
    ensure(this.state.kind === 'Deployed', InvalidWalletState, 'Deployed', this.state.kind);
    return this.state.wallet;
  }

  private getDeployingWallet(): DeployingWallet {
    ensure(this.state.kind === 'Deploying', InvalidWalletState, 'Deploying', this.state.kind);
    return this.state.wallet;
  }

  getConnectingWallet(): ConnectingWallet {
    ensure(this.state.kind === 'Connecting', Error, 'Invalid state: expected connecting wallet');
    return this.state.wallet;
  }

  async createFutureWallet(name: string): Promise<FutureWallet> {
    const futureWallet = await this.sdk.createFutureWallet();
    this.setFutureWallet(futureWallet, name);
    return futureWallet;
  }

  async initDeploy() {
    ensure(this.state.kind === 'Future', InvalidWalletState, 'Future', this.state.kind);
    const {name, wallet: {deploy}} = this.state;
    const deployingWallet = await deploy(name, this.gasParameters.gasPrice.toString(), this.gasParameters.gasToken);
    this.stateProperty.set({kind: 'Deploying', wallet: deployingWallet});
    this.saveToStorage();
    return this.getDeployingWallet();
  }

  async waitForTransactionHash() {
    const deployingWallet = this.getDeployingWallet();
    const {transactionHash} = await deployingWallet.waitForTransactionHash();
    ensureNotNull(transactionHash, TransactionHashNotFound);
    this.stateProperty.set({kind: 'Deploying', wallet: deployingWallet, transactionHash});
    this.saveToStorage();
    return deployingWallet;
  }

  async waitToBeSuccess() {
    const deployingWallet = this.getDeployingWallet();
    const deployedWallet = await deployingWallet.waitToBeSuccess();
    this.stateProperty.set({kind: 'Deployed', wallet: deployedWallet});
    this.saveToStorage();
    return deployedWallet;
  }

  async deployFutureWallet() {
    await this.initDeploy();
    await this.waitForTransactionHash();
    return this.waitToBeSuccess();
  }

  setFutureWallet(wallet: FutureWallet, name: string) {
    ensure(this.state.kind === 'None', WalletOverridden);
    this.stateProperty.set({kind: 'Future', name, wallet});
    this.saveToStorage();
  }

  setDeployed() {
    ensure(this.state.kind === 'Future', InvalidWalletState, 'Future', this.state.kind);
    const {name, wallet: {contractAddress, privateKey}} = this.state;
    const wallet = new DeployedWallet(contractAddress, name, privateKey, this.sdk);
    this.stateProperty.set({kind: 'Deployed', wallet});
    this.saveToStorage();
  }

  setConnecting(wallet: ConnectingWallet) {
    ensure(this.state.kind === 'None', WalletOverridden);
    this.stateProperty.set({kind: 'Connecting', wallet});
  }

  setWallet(wallet: ApplicationWallet) {
    ensure(this.state.kind === 'None' || this.state.kind === 'Connecting', WalletOverridden);
    this.stateProperty.set({
      kind: 'Deployed',
      wallet: new DeployedWallet(wallet.contractAddress, wallet.name, wallet.privateKey, this.sdk),
    });
    this.saveToStorage();
  }

  async recover(name: string, passphrase: string) {
    const contractAddress = await this.sdk.getWalletContractAddress(name);
    const wallet = await this.walletFromPassphrase(name, passphrase);
    ensure(await this.sdk.keyExist(contractAddress, wallet.address), InvalidPassphrase);
    const applicationWallet: ApplicationWallet = {contractAddress, name, privateKey: wallet.privateKey};
    this.setWallet(applicationWallet);
  }

  async initializeConnection(name: string): Promise<number[]> {
    const contractAddress = await this.sdk.getWalletContractAddress(name);
    const {privateKey, securityCode} = await this.sdk.connect(contractAddress);
    const connectingWallet: ConnectingWallet = new ConnectingWallet(contractAddress, name, privateKey);
    this.setConnecting(connectingWallet);
    return securityCode;
  }

  async waitForConnection() {
    if (this.state.kind === 'Deployed') return;
    ensure(this.state.kind === 'Connecting', InvalidWalletState, 'Connecting', this.state.kind);
    const connectingWallet = this.getConnectingWallet();
    const filter = {
      contractAddress: connectingWallet.contractAddress,
      key: connectingWallet.publicKey,
    };
    return new Promise((resolve, reject) => {
      const setWallet = this.setWallet.bind(this);
      const subscription = this.sdk.subscribe('KeyAdded', filter, () => {
        setWallet(connectingWallet);
        subscription.remove();
        resolve();
      });
      connectingWallet.setSubscription(subscription);
    });
  }

  async cancelWaitForConnection() {
    if (this.state.kind === 'Deployed') return;
    this.getConnectingWallet().subscription && this.getConnectingWallet().subscription!.remove();
    this.disconnect();
  }

  async connect(name: string, callback: Procedure) {
    const contractAddress = await this.sdk.getWalletContractAddress(name);
    const {privateKey, securityCode} = await this.sdk.connect(contractAddress);
    const connectingWallet: ConnectingWallet = new ConnectingWallet(contractAddress, name, privateKey);
    this.setConnecting(connectingWallet);

    const filter = {
      contractAddress,
      key: utils.computeAddress(privateKey),
    };

    const subscription = this.sdk.subscribe('KeyAdded', filter, () => {
      this.setWallet(connectingWallet);
      subscription.remove();
      callback();
    });

    return {
      unsubscribe: () => subscription.remove(),
      securityCode,
    };
  }

  async removeWallet(executionOptions: ExecutionOptions) {
    if (this.state.kind !== 'Deployed') {
      this.disconnect();
      return;
    }
    const execution = await this.state.wallet.removeCurrentKey(executionOptions);
    execution.waitToBeSuccess().then(() => this.disconnect());
    return execution;
  }

  disconnect(): void {
    this.stateProperty.set({kind: 'None'});
    this.saveToStorage();
  }

  saveToStorage() {
    const serialized = this.walletSerializer.serialize(this.state);
    if (serialized !== undefined) {
      this.storage.save(serialized);
    }
  }

  async loadFromStorage() {
    ensure(this.state.kind === 'None', WalletOverridden);
    const state = this.storage.load();
    this.stateProperty.set(await this.walletSerializer.deserialize(state));
  }

  setGasParameters(gasParameters: GasParameters) {
    this.gasParameters = gasParameters;
  }
}
