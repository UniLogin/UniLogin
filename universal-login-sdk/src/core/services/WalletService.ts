import {ensure, Choose, walletFromBrain, Procedure, ExecutionOptions, ensureNotFalsy, findGasOption, FAST_GAS_MODE_INDEX, ETHER_NATIVE_TOKEN, waitUntil, PartialRequired} from '@unilogin/commons';
import UniLoginSdk from '../../api/sdk';
import {FutureWallet} from '../../api/wallet/FutureWallet';
import {DeployingWallet} from '../../api/wallet/DeployingWallet';
import {ApiKeyMissing, InvalidWalletState, InvalidPassphrase, WalletOverridden, TransactionHashNotFound} from '../utils/errors';
import {utils, Wallet} from 'ethers';
import {DeployedWallet, WalletStorage} from '../..';
import {map, State, Property} from 'reactive-properties';
import {WalletState, SerializedDeployedWallet} from '../models/WalletService';
import {IStorageService} from '../models/IStorageService';
import {WalletSerializer} from './WalletSerializer';
import {ConnectingWallet} from '../../api/wallet/ConnectingWallet';
import {NoopStorageService} from './NoopStorageService';
import {WalletStorageService} from './WalletStorageService';
import {RequestedCreatingWallet} from '../../api/wallet/RequestedCreatingWallet';
import {ConfirmedWallet} from '../../api/wallet/ConfirmedWallet';
import {RequestedRestoringWallet} from '../../api/wallet/RequestedRestoringWallet';
import {RestoringWallet} from '../../api/wallet/RestoringWallet';
import {DeployedWithoutEmailWallet} from '../../api/wallet/DeployedWallet';
import {ensureKind} from '../utils/ensureKind';
import {RequestedMigratingWallet} from '../../api/wallet/RequestedMigrating';
import {ConfirmedMigratingWallet} from '../../api/wallet/ConfirmedMigratingWallet';

type WalletFromBackupCodes = (username: string, password: string) => Promise<Wallet>;

interface WalletStorageWithMigration extends WalletStorage {
  migrate?: () => Promise<void>;
}

export class WalletService {
  private readonly walletSerializer: WalletSerializer;
  private readonly walletStorage: WalletStorageWithMigration;

  private readonly _stateProperty = new State<WalletState>({kind: 'None'});
  readonly stateProperty: Property<WalletState> = this._stateProperty;

  walletDeployed = this.stateProperty.pipe(map((state) => state.kind === 'Deployed' || state.kind === 'DeployedWithoutEmail' || state.kind === 'RequestedMigrating' || state.kind === 'ConfirmedMigrating'));
  isAuthorized = this.walletDeployed;

  get state() {
    return this.stateProperty.get();
  }

  private setState(state: WalletState) {
    this.saveToStorage(state);
    this._stateProperty.set(state);
  }

  constructor(
    public readonly sdk: UniLoginSdk,
    private readonly walletFromPassphrase: WalletFromBackupCodes = walletFromBrain,
    storageService: IStorageService = new NoopStorageService(),
  ) {
    this.walletStorage = new WalletStorageService(storageService, sdk.config.network);
    this.walletSerializer = new WalletSerializer(sdk);
  }

  isDeployed(state = this.state): state is Choose<WalletState, 'Deployed' | 'DeployedWithoutEmail' | 'RequestedMigrating' | 'ConfirmedMigrating'> {
    return this.walletDeployed.get();
  }

  getDeployedWallet(): DeployedWithoutEmailWallet {
    ensureKind(this.state, 'Deployed', 'DeployedWithoutEmail', 'RequestedMigrating', 'ConfirmedMigrating');
    return this.state.wallet;
  }

  getFutureWallet() {
    ensureKind(this.state, 'Future');
    return this.state.wallet;
  }

  private getDeployingWallet(): DeployingWallet {
    ensureKind(this.state, 'Deploying');
    return this.state.wallet;
  }

  getConnectingWallet(): ConnectingWallet {
    ensureKind(this.state, 'Connecting');
    return this.state.wallet;
  }

  getConfirmedWallet(): ConfirmedWallet {
    ensureKind(this.state, 'Confirmed');
    return this.state.wallet;
  }

  async confirmCode(code: string) {
    ensureKind(this.state, 'RequestedCreating', 'RequestedRestoring', 'RequestedMigrating');
    if (this.state.kind === 'RequestedCreating') {
      const confirmedWallet = await this.state.wallet.confirmEmail(code);
      this.setConfirmed(confirmedWallet);
      return confirmedWallet;
    } else if (this.state.kind === 'RequestedRestoring') {
      const restoringWallet = await this.state.wallet.confirmEmail(code);
      this.setRestoring(restoringWallet);
      return restoringWallet;
    } else {
      const confirmedMigratingWallet = await this.state.wallet.confirmEmail(code);
      this.setConfirmedMigrating(confirmedMigratingWallet);
      return confirmedMigratingWallet;
    }
  }

  async createPassword(password: string) {
    ensureKind(this.state, 'ConfirmedMigrating');
    const deployedWallet = await this.state.wallet.setPassword(password);
    this.setWallet(deployedWallet);
    return deployedWallet;
  }

  async restoreWallet(password: string) {
    ensureKind(this.state, 'Restoring');
    const wallet = await this.state.wallet.restore(password);
    if (wallet instanceof DeployedWallet) {
      this.setWallet(wallet);
    } else {
      this.setFutureWallet(wallet, wallet.ensName);
    }
    return wallet;
  }

  getRequestedCreatingWallet() {
    ensureKind(this.state, 'RequestedCreating');
    return this.state.wallet;
  }

  getRequestedMigrating() {
    ensureKind(this.state, 'RequestedMigrating');
    return this.state.wallet;
  }

  getRequestedRestoringWallet() {
    ensureKind(this.state, 'RequestedRestoring');
    return this.state.wallet;
  }

  getRestoringWallet() {
    ensureKind(this.state, 'Restoring');
    return this.state.wallet;
  }

  async createRequestedCreatingWallet(email: string, ensName: string) {
    const requestedWallet = new RequestedCreatingWallet(this.sdk, email, ensName);
    this.setRequested(requestedWallet);
    return this.getRequestedCreatingWallet().requestEmailConfirmation();
  }

  async createRequestedRestoringWallet(ensNameOrEmail: string) {
    const requestedWallet = new RequestedRestoringWallet(this.sdk, ensNameOrEmail);
    this.setRequestedRestoring(requestedWallet);
    try {
      return await this.getRequestedRestoringWallet().requestEmailConfirmation();
    } catch (e) {
      this.disconnect();
      throw e;
    }
  }

  async createRequestedMigratingWallet(email: string) {
    ensureKind(this.state, 'DeployedWithoutEmail');
    const requestedMigrating = new RequestedMigratingWallet(
      this.state.wallet.contractAddress,
      this.state.wallet.name,
      this.state.wallet.privateKey,
      email,
      this.sdk,
    );
    this.setRequestedMigrating(requestedMigrating);
    try {
      return await this.getRequestedMigrating().requestEmailConfirmation();
    } catch (e) {
      this.migrationRollback();
      throw e;
    }
  }

  migrationRollback() {
    ensureKind(this.state, 'RequestedMigrating', 'ConfirmedMigrating');
    this.setWallet(this.state.wallet.asSerializedDeployedWithoutEmailWallet);
  }

  async retryRequestEmailConfirmation() {
    ensureKind(this.state, 'RequestedRestoring', 'RequestedCreating', 'RequestedMigrating');
    return this.state.wallet.requestEmailConfirmation();
  }

  async createDeployingWallet(name: string): Promise<DeployingWallet> {
    ensure(this.sdk.isRefundPaid(), ApiKeyMissing);
    const futureWallet = await this.sdk.createFutureWallet(name, '0', ETHER_NATIVE_TOKEN.address);
    const deployingWallet = await futureWallet.deploy();
    this.setDeploying(deployingWallet);
    return deployingWallet;
  }

  async createFutureWallet(name: string, gasToken = ETHER_NATIVE_TOKEN.address): Promise<FutureWallet> {
    ensureKind(this.state, 'None');
    const gasModes = await this.sdk.getGasModes();
    const gasOption = findGasOption(gasModes[FAST_GAS_MODE_INDEX].gasOptions, gasToken);
    const futureWallet = await this.sdk.createFutureWallet(name, gasOption.gasPrice.toString(), gasToken);
    this.setFutureWallet(futureWallet, name);
    return futureWallet;
  }

  async createDeployingWalletWithPassword(password: string): Promise<DeployingWallet> {
    ensure(this.sdk.isRefundPaid(), ApiKeyMissing);
    ensureKind(this.state, 'Confirmed');
    const futureWallet = await this.sdk.getFutureWalletFactory().createNewWithPassword(this.state.wallet.asSerializableConfirmedWallet, '0', ETHER_NATIVE_TOKEN.address, password);
    const deployingWallet = await futureWallet.deploy();
    this.setDeploying(deployingWallet);
    return deployingWallet;
  }

  async createFutureWalletWithPassword(password: string, gasToken = ETHER_NATIVE_TOKEN.address): Promise<FutureWallet> {
    ensureKind(this.state, 'Confirmed');
    const gasModes = await this.sdk.getGasModes();
    const gasOption = findGasOption(gasModes[FAST_GAS_MODE_INDEX].gasOptions, gasToken);
    const futureWallet = await this.sdk.getFutureWalletFactory().createNewWithPassword(this.state.wallet.asSerializableConfirmedWallet, gasOption.gasPrice.toString(), gasToken, password);
    this.setFutureWallet(futureWallet, futureWallet.ensName);
    return futureWallet;
  }

  async initDeploy() {
    ensureKind(this.state, 'Future');
    const {wallet: {deploy}} = this.state;
    const deployingWallet = await deploy();
    this.setState({kind: 'Deploying', wallet: deployingWallet});
    return this.getDeployingWallet();
  }

  async waitForTransactionHash() {
    if (this.isDeployed(this.state)) {
      return this.state.wallet;
    }
    const deployingWallet = this.getDeployingWallet();
    const {transactionHash} = await deployingWallet.waitForTransactionHash();
    ensureNotFalsy(transactionHash, TransactionHashNotFound);
    this.setState({kind: 'Deploying', wallet: deployingWallet, transactionHash});
    return deployingWallet;
  }

  async waitToBeSuccess() {
    if (this.isDeployed(this.state)) {
      return this.state.wallet;
    }
    const deployingWallet = this.getDeployingWallet();
    const deployedWallet = await deployingWallet.waitToBeSuccess();
    if (deployedWallet instanceof DeployedWallet) {
      this.setState({kind: 'Deployed', wallet: deployedWallet});
    } else {
      this.setState({kind: 'DeployedWithoutEmail', wallet: deployedWallet});
    }
    return deployedWallet;
  }

  async deployFutureWallet() {
    await this.initDeploy();
    await this.waitForTransactionHash();
    return this.waitToBeSuccess();
  }

  setRequestedMigrating(wallet: RequestedMigratingWallet) {
    ensureKind(this.state, 'DeployedWithoutEmail');
    this.setState({kind: 'RequestedMigrating', wallet});
  }

  setConfirmedMigrating(wallet: ConfirmedMigratingWallet) {
    ensureKind(this.state, 'RequestedMigrating');
    this.setState({kind: 'ConfirmedMigrating', wallet});
  }

  setRequested(wallet: RequestedCreatingWallet) {
    ensure(this.state.kind === 'None', WalletOverridden);
    this.setState({kind: 'RequestedCreating', wallet});
  }

  setRequestedRestoring(wallet: RequestedRestoringWallet) {
    ensure(this.state.kind === 'None', WalletOverridden);
    this.setState({kind: 'RequestedRestoring', wallet});
  }

  setConfirmed(wallet: ConfirmedWallet) {
    ensure(this.state.kind === 'RequestedCreating', WalletOverridden);
    this.setState({kind: 'Confirmed', wallet});
  }

  setRestoring(wallet: RestoringWallet) {
    ensure(this.state.kind === 'RequestedRestoring', WalletOverridden);
    this.setState({kind: 'Restoring', wallet});
  }

  setFutureWallet(wallet: FutureWallet, name: string) {
    ensure(this.state.kind === 'None' || this.state.kind === 'Confirmed' || this.state.kind === 'Restoring', WalletOverridden);
    this.setState({kind: 'Future', name, wallet});
  }

  setDeploying(wallet: DeployingWallet) {
    ensureKind(this.state, 'None', 'Confirmed');
    this.setState({kind: 'Deploying', wallet});
  }

  setConnecting(wallet: ConnectingWallet) {
    ensure(this.state.kind === 'None', WalletOverridden);
    this._stateProperty.set({kind: 'Connecting', wallet});
  }

  setWallet(wallet: PartialRequired<SerializedDeployedWallet, 'contractAddress' | 'privateKey' | 'name'>) {
    ensureKind(this.state, 'None', 'Connecting', 'Restoring', 'RequestedMigrating', 'ConfirmedMigrating');
    if (wallet.email) {
      this.setState({
        kind: 'Deployed',
        wallet: new DeployedWallet(wallet.contractAddress, wallet.name, wallet.privateKey, this.sdk, wallet.email),
      });
    } else {
      this.setState({
        kind: 'DeployedWithoutEmail',
        wallet: new DeployedWithoutEmailWallet(wallet.contractAddress, wallet.name, wallet.privateKey, this.sdk),
      });
    }
  }

  async recover(name: string, passphrase: string) {
    const contractAddress = await this.sdk.getWalletContractAddress(name);
    const wallet = await this.walletFromPassphrase(name, passphrase);
    const deployedWallet = new DeployedWithoutEmailWallet(contractAddress, name, wallet.privateKey, this.sdk);
    ensure(await deployedWallet.keyExist(wallet.address), InvalidPassphrase);
    this.setWallet(deployedWallet.asSerializedDeployedWithoutEmailWallet);
  }

  async initializeConnection(name: string): Promise<number[]> {
    const contractAddress = await this.sdk.getWalletContractAddress(name);
    const {privateKey, securityCode} = await this.sdk.connect(contractAddress);
    const connectingWallet: ConnectingWallet = new ConnectingWallet(contractAddress, name, privateKey, this.sdk);
    this.setConnecting(connectingWallet);
    this.setState({kind: 'Connecting', wallet: connectingWallet});
    return securityCode;
  }

  async waitForConnection() {
    if (this.isDeployed(this.state)) return;
    ensureKind(this.state, 'Connecting');
    const connectingWallet = this.getConnectingWallet();
    const filter = {
      contractAddress: connectingWallet.contractAddress,
      key: connectingWallet.publicKey,
    };
    const addKeyEvent = await this.sdk.walletContractService.getEventNameFor(connectingWallet.contractAddress, 'KeyAdded');
    return new Promise((resolve, reject) => {
      const setWallet = this.setWallet.bind(this);
      const unsubscribe = this.sdk.subscribe(addKeyEvent, filter, () => {
        setWallet(connectingWallet);
        unsubscribe();
        resolve();
      });
      connectingWallet.unsubscribe = unsubscribe;
    });
  }

  async cancelWaitForConnection(tick = 500, timeout = 1500) {
    if (this.isDeployed(this.state)) return;
    await waitUntil(() => !!this.getConnectingWallet().unsubscribe, tick, timeout);
    this.getConnectingWallet().unsubscribe!();
    this.disconnect();
  }

  async connect(name: string, callback: Procedure) {
    const contractAddress = await this.sdk.getWalletContractAddress(name);
    const {privateKey, securityCode} = await this.sdk.connect(contractAddress);
    const connectingWallet: ConnectingWallet = new ConnectingWallet(contractAddress, name, privateKey, this.sdk);
    this.setConnecting(connectingWallet);
    this.setState({kind: 'Connecting', wallet: connectingWallet});

    const filter = {
      contractAddress,
      key: utils.computeAddress(privateKey),
    };
    const addKeyEvent = await this.sdk.walletContractService.getEventNameFor(connectingWallet.contractAddress, 'KeyAdded');
    const unsubscribe = this.sdk.subscribe(addKeyEvent, filter, () => {
      this.setWallet(connectingWallet);
      unsubscribe;
      callback();
    });

    return {unsubscribe, securityCode};
  }

  async removeWallet(executionOptions: ExecutionOptions) {
    if (!this.isDeployed(this.state)) {
      this.disconnect();
      return;
    }
    const existingKeysCount = (await this.state.wallet.getKeys()).length;
    if (existingKeysCount > 1) {
      const execution = await this.state.wallet.removeCurrentKey(executionOptions);
      execution.waitToBeSuccess().then(() => this.disconnect());
      return execution;
    }
    this.disconnect();
  }

  disconnect(): void {
    this.setState({kind: 'None'});
  }

  saveToStorage(state: WalletState) {
    const serialized = this.walletSerializer.serialize(state);
    if (serialized !== undefined) {
      this.walletStorage.save(serialized);
    }
  }

  async loadFromStorage() {
    ensure(this.state.kind === 'None', WalletOverridden);
    await this.walletStorage.migrate?.();
    const state = this.walletStorage.load();
    this._stateProperty.set(this.walletSerializer.deserialize(state));
  }

  finalize() {
    this._stateProperty.set({kind: 'None'});
  }

  getRequiredDeploymentBalance() {
    ensureKind(this.state, 'Future');
    return this.state.wallet.getMinimalAmount();
  }

  isKind(kind: string) {
    return this.state.kind === kind;
  }

  getContractAddress() {
    ensure(this.state.kind !== 'None', InvalidWalletState, 'not None', this.state.kind);
    ensure(this.state.kind !== 'RequestedCreating', InvalidWalletState, 'not RequestedCreating', this.state.kind);
    ensure(this.state.kind !== 'RequestedRestoring', InvalidWalletState, 'not RequestedRestoring', this.state.kind);
    ensure(this.state.kind !== 'Confirmed', InvalidWalletState, 'not Confirmed', this.state.kind);
    ensure(this.state.kind !== 'Restoring', InvalidWalletState, 'not Restoring', this.state.kind);
    return this.state.wallet.contractAddress;
  }

  getEnsNameOrEmail() {
    ensureKind(this.state, 'RequestedCreating', 'RequestedRestoring', 'RequestedMigrating', 'ConfirmedMigrating');
    if (this.state.kind === 'RequestedCreating' || this.state.kind === 'RequestedMigrating' || this.state.kind === 'ConfirmedMigrating') {
      return this.state.wallet.email;
    } else {
      return this.state.wallet.ensNameOrEmail;
    }
  }
}
