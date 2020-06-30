import {ApplicationWallet, DEFAULT_GAS_LIMIT, ExecutionOptions, generateBackupCode, Message, walletFromBrain, ETHER_NATIVE_TOKEN, OperationType, ensure, SignedMessage, Device, Procedure, GasMode} from '@unilogin/commons';
import {utils} from 'ethers';
import {BigNumber} from 'ethers/utils';
import {OnBalanceChange} from '../../core/observers/BalanceObserver';
import {AbstractWallet} from './AbstractWallet';
import {BackupCodesWithExecution} from './BackupCodesWithExecution';
import {InvalidGasLimit} from '../../core/utils/errors';
import {ensureSufficientGas} from '../../core/utils/validation';
import UniLoginSdk from '../sdk';
import {Execution} from '../../core/services/ExecutionFactory';
import {propertyFromSubscription} from '../../core/utils/propertyFromSubscription';
import {OnErc721TokensChange} from '../../core/observers/Erc721TokensObserver';

export class DeployedWallet extends AbstractWallet {
  constructor(
    contractAddress: string,
    name: string,
    privateKey: string,
    public readonly sdk: UniLoginSdk,
  ) {
    super(contractAddress, name, privateKey);
  }

  get asApplicationWallet(): ApplicationWallet {
    return {
      contractAddress: this.contractAddress,
      name: this.name,
      privateKey: this.privateKey,
    };
  }

  addKey(publicKey: string, executionOptions: ExecutionOptions): Promise<Execution> {
    return this.selfExecute('addKey', [publicKey], executionOptions, '20000');
  }

  addKeys(publicKeys: string[], executionOptions: ExecutionOptions): Promise<Execution> {
    return this.selfExecute('addKeys', [publicKeys], executionOptions, '30000');
  }

  removeKey(key: string, executionOptions: ExecutionOptions): Promise<Execution> {
    return this.selfExecute('removeKey', [key], executionOptions, '55000');
  }

  setRequiredSignatures(requiredSignatures: number, executionOptions: ExecutionOptions): Promise<Execution> {
    return this.selfExecute('setRequiredSignatures', [requiredSignatures], executionOptions, '70000');
  }

  removeCurrentKey(executionOptions: ExecutionOptions): Promise<Execution> {
    const ownKey = utils.computeAddress(this.privateKey);
    return this.removeKey(ownKey, executionOptions);
  }

  async denyRequests() {
    const authorisationRequest = {contractAddress: this.contractAddress};
    await this.sdk.walletContractService.signRelayerRequest(this.privateKey, authorisationRequest);
    await this.sdk.relayerApi.denyConnection(authorisationRequest);
  }

  private async getSignedMessage(message: Partial<Message>) {
    const relayerConfig = this.sdk.getRelayerConfig();
    const nonce = message.nonce || await this.getNonce();
    const partialMessage = {
      gasToken: ETHER_NATIVE_TOKEN.address,
      ...message,
      nonce,
      refundReceiver: relayerConfig.relayerAddress,
      operationType: OperationType.call,
      from: this.contractAddress,
      gasPrice: this.sdk.isRefundPaid() ? '0' : message.gasPrice,
    };
    return this.sdk.messageConverter.messageToSignedMessage(partialMessage, this.privateKey);
  }

  async execute(message: Partial<Message>): Promise<Execution> {
    const relayerConfig = this.sdk.getRelayerConfig();
    ensure(message.gasLimit! <= relayerConfig.maxGasLimit, InvalidGasLimit, `${message.gasLimit} provided, when relayer's max gas limit is ${relayerConfig.maxGasLimit}`);
    const signedMessage: SignedMessage = await this.getSignedMessage(message);
    await this.sdk.sufficientBalanceValidator.validate(signedMessage);
    ensureSufficientGas(signedMessage);
    return this.sdk.executionFactory.createExecution(signedMessage);
  }

  keyExist(key: string): Promise<boolean> {
    return this.sdk.walletContractService.keyExist(this.contractAddress, key);
  }

  getNonce(): Promise<number> {
    return this.sdk.walletContractService.lastNonce(this.contractAddress);
  }

  getConnectedDevices(): Promise<any> {
    return this.sdk.getConnectedDevices(this.contractAddress, this.privateKey);
  }

  async getKeys() {
    return (await this.getConnectedDevices())
      .map((device: Device) => device.publicKey);
  }

  getRequiredSignatures(): Promise<BigNumber> {
    return this.sdk.walletContractService.requiredSignatures(this.contractAddress);
  }

  getGasModes(): Promise<GasMode[]> {
    return this.sdk.getGasModes();
  }

  async selfExecute(method: string, args: any[], executionOptions: ExecutionOptions, gasLimitMargin: utils.BigNumberish): Promise<Execution> {
    const message = await this.getMessageFor(method, args, executionOptions);
    const estimatedGas = await this.estimateGas(message, gasLimitMargin);
    return this.execute({...message, ...executionOptions, gasLimit: estimatedGas});
  }

  async getMessageFor(method: string, args: any[], executionOptions: ExecutionOptions): Promise<Partial<Message>> {
    const data = await this.sdk.walletContractService.encodeFunction(this.contractAddress, method, args);
    return {
      gasLimit: DEFAULT_GAS_LIMIT,
      ...executionOptions,
      to: this.contractAddress,
      from: this.contractAddress,
      data,
    };
  }

  async estimateGasFor(method: string, args: any[], overrides: ExecutionOptions) {
    const message = await this.getMessageFor(method, args, overrides);
    return this.estimateGas(message);
  }

  async estimateGas(partialMessage: Partial<Message>, gasLimitMargin: utils.BigNumberish = '50000') {
    const message: Partial<Message> = {
      gasLimit: DEFAULT_GAS_LIMIT,
      from: this.contractAddress,
      ...partialMessage,
    };
    const signedMessage = await this.getSignedMessage(message);
    const estimatedGas = await this.sdk.provider.estimateGas({to: this.contractAddress, from: this.sdk.getRelayerConfig().relayerAddress, data: await this.sdk.walletContractService.encodeExecute(this.contractAddress, signedMessage)});
    return estimatedGas.add(gasLimitMargin).toString();
  }

  async generateBackupCodes(executionOptions: ExecutionOptions): Promise<BackupCodesWithExecution> {
    const codes: string[] = [generateBackupCode()];
    const addresses: string[] = [];

    for (const code of codes) {
      const {address} = await walletFromBrain(this.name, code);
      addresses.push(address);
    }

    const execution = await this.addKey(addresses[0], executionOptions);
    return new BackupCodesWithExecution(execution, codes);
  }

  signMessage(bytes: Uint8Array) {
    return this.sdk.walletContractService.signMessage(this.contractAddress, this.privateKey, bytes);
  }

  subscribeAuthorisations(callback: Function) {
    return this.sdk.subscribeAuthorisations(this.contractAddress, this.privateKey, callback);
  }

  readonly authorizations = propertyFromSubscription(this.subscribeAuthorisations.bind(this), []);

  subscribeToBalances(callback: OnBalanceChange) {
    return this.sdk.subscribeToBalances(this.contractAddress, callback);
  }

  subscribeToErc721Tokens(callback: OnErc721TokensChange) {
    return this.sdk.subscribeToErc721Tokens(this.contractAddress, callback);
  }

  async subscribeDisconnected(onDisconnected: Procedure) {
    const eventName = await this.sdk.walletContractService.getEventNameFor(this.contractAddress, 'KeyRemoved');
    const unsubscribe = this.sdk.subscribe(
      eventName,
      {contractAddress: this.contractAddress, key: this.publicKey},
      () => onDisconnected(),
    );
    return () => unsubscribe();
  }
}
