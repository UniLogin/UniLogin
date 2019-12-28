import {ApplicationWallet, DEFAULT_GAS_LIMIT, ExecutionOptions, generateBackupCode, Message, SdkExecutionOptions, sign, walletFromBrain, ETHER_NATIVE_TOKEN, OperationType, ensure, SignedMessage, Device, Procedure} from '@universal-login/commons';
import {WalletContractInterface} from '@universal-login/contracts';
import {Contract, utils} from 'ethers';
import {BigNumber} from 'ethers/utils';
import {OnBalanceChange} from '../../core/observers/BalanceObserver';
import {AbstractWallet} from './AbstractWallet';
import {BackupCodesWithExecution} from './BackupCodesWithExecution';
import {InvalidGasLimit} from '../../core/utils/errors';
import {ensureSufficientGas} from '../../core/utils/validation';
import UniversalLoginSDK from '../sdk';
import {Execution} from '../../core/services/ExecutionFactory';

export class DeployedWallet extends AbstractWallet {
  private contractInstance: Contract;

  constructor(
    contractAddress: string,
    name: string,
    privateKey: string,
    public readonly sdk: UniversalLoginSDK,
  ) {
    super(contractAddress, name, privateKey);
    this.contractInstance = new Contract(this.contractAddress, WalletContractInterface, this.sdk.provider);
  }

  get asApplicationWallet(): ApplicationWallet {
    return {
      contractAddress: this.contractAddress,
      name: this.name,
      privateKey: this.privateKey,
    };
  }

  addKey(publicKey: string, executionOptions: ExecutionOptions): Promise<Execution> {
    return this.selfExecute('addKey', [publicKey], {gasLimit: DEFAULT_GAS_LIMIT, ...executionOptions});
  }

  addKeys(publicKeys: string[], executionOptions: ExecutionOptions): Promise<Execution> {
    return this.selfExecute('addKeys', [publicKeys], {gasLimit: DEFAULT_GAS_LIMIT, ...executionOptions});
  }

  removeKey(key: string, executionOptions: ExecutionOptions): Promise<Execution> {
    return this.selfExecute('removeKey', [key], {gasLimit: DEFAULT_GAS_LIMIT, ...executionOptions});
  }

  removeCurrentKey(executionOptions: ExecutionOptions): Promise<Execution> {
    const ownKey = utils.computeAddress(this.privateKey);
    return this.removeKey(ownKey, executionOptions);
  }

  async denyRequests() {
    return this.sdk.denyRequests(this.contractAddress, this.privateKey);
  }

  setRequiredSignatures(requiredSignatures: number, executionOptions: ExecutionOptions): Promise<Execution> {
    return this.selfExecute('setRequiredSignatures', [requiredSignatures], {gasLimit: DEFAULT_GAS_LIMIT, ...executionOptions});
  }

  async execute(message: Partial<Message>): Promise<Execution> {
    const relayerConfig = this.sdk.getRelayerConfig();
    const nonce = message.nonce || parseInt(await this.getNonce(), 10);
    const partialMessage = {
      gasToken: ETHER_NATIVE_TOKEN.address,
      ...message,
      nonce,
      refundReceiver: relayerConfig.relayerAddress,
      operationType: OperationType.call,
      from: this.contractAddress,
    };
    ensure(partialMessage.gasLimit! <= relayerConfig.maxGasLimit, InvalidGasLimit, `${partialMessage.gasLimit} provided, when relayer's max gas limit is ${relayerConfig.maxGasLimit}`);
    const signedMessage: SignedMessage = await this.sdk.messageConverter.messageToSignedMessage(partialMessage, this.privateKey);
    ensureSufficientGas(signedMessage);
    return this.sdk.executionFactory.createExecution(signedMessage);
  }

  keyExist(key: string): Promise<boolean> {
    return this.contractInstance.keyExist(key);
  }

  async getNonce() {
    return this.contractInstance.lastNonce();
  }

  async getConnectedDevices() {
    return this.sdk.getConnectedDevices(this.contractAddress, this.privateKey);
  }

  async getKeys() {
    return (await this.getConnectedDevices())
      .map((device: Device) => device.publicKey);
  }

  getRequiredSignatures(): Promise<BigNumber> {
    return this.contractInstance.requiredSignatures();
  }

  async getGasModes() {
    return this.sdk.getGasModes();
  }

  selfExecute(method: string, args: any[], executionOptions: SdkExecutionOptions): Promise<Execution> {
    const data = WalletContractInterface.functions[method].encode(args);
    const message: Partial<Message> = {
      ...executionOptions,
      to: this.contractAddress,
      from: this.contractAddress,
      data,
    };
    return this.execute(message);
  }

  async generateBackupCodes(executionOptions: ExecutionOptions): Promise<BackupCodesWithExecution> {
    const codes: string[] = [generateBackupCode(), generateBackupCode()];
    const addresses: string[] = [];

    for (const code of codes) {
      const {address} = await walletFromBrain(this.name, code);
      addresses.push(address);
    }

    const execution = await this.addKeys(addresses, {gasLimit: DEFAULT_GAS_LIMIT, ...executionOptions});
    return new BackupCodesWithExecution(execution, codes);
  }

  signMessage(bytes: Uint8Array) {
    return sign(bytes, this.privateKey);
  }

  subscribeAuthorisations(callback: Function) {
    return this.sdk.subscribeAuthorisations(this.contractAddress, this.privateKey, callback);
  }

  subscribeToBalances(callback: OnBalanceChange) {
    return this.sdk.subscribeToBalances(this.contractAddress, callback);
  }

  subscribeDisconnected(onDisconnected: Procedure) {
    const unsubscribe = this.sdk.subscribe(
      'KeyRemoved',
      {contractAddress: this.contractAddress, key: this.publicKey},
      () => onDisconnected(),
    );
    return () => unsubscribe();
  }
}
