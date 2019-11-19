import {
  ApplicationWallet,
  Message,
  generateBackupCode,
  walletFromBrain,
  sign,
  MessageStatus,
  ExecutionOptions,
  DEFAULT_GAS_LIMIT,
  SdkExecutionOptions,
} from '@universal-login/commons';
import UniversalLoginSDK from './sdk';
import {Execution} from '../core/services/ExecutionFactory';
import {Contract, utils} from 'ethers';
import {BigNumber} from 'ethers/utils';
import {OnBalanceChange} from '../core/observers/BalanceObserver';
import {WalletContractInterface} from '@universal-login/contracts';

interface BackupCodesWithExecution {
  waitToBeSuccess: () => Promise<string[]>;
  waitForTransactionHash: () => Promise<MessageStatus>;
}

export class DeployedWallet implements ApplicationWallet {
  private contractInstance: Contract;

  constructor(
    public readonly contractAddress: string,
    public readonly name: string,
    public readonly privateKey: string,
    public readonly sdk: UniversalLoginSDK,
  ) {
    this.contractInstance = new Contract(this.contractAddress, WalletContractInterface, this.sdk.provider);
  }

  get publicKey() {
    return utils.computeAddress(this.privateKey);
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

  execute(message: Partial<Message>): Promise<Execution> {
    return this.sdk.execute({
      from: this.contractAddress,
      gasLimit: DEFAULT_GAS_LIMIT,
      ...message,
    }, this.privateKey);
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
    return this.sdk.execute(message, this.privateKey);
  }

  async generateBackupCodes(executionOptions: ExecutionOptions): Promise<BackupCodesWithExecution> {
    const codes: string[] = [generateBackupCode(), generateBackupCode()];
    const addresses: string[] = [];

    for (const code of codes) {
      const {address} = await walletFromBrain(this.name, code);
      addresses.push(address);
    }

    const execution = await this.addKeys(addresses, {gasLimit: DEFAULT_GAS_LIMIT, ...executionOptions});
    return {
      waitToBeSuccess: async () => {
        await execution.waitToBeSuccess();
        return codes;
      },
      waitForTransactionHash: execution.waitForTransactionHash,
    };
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

  subscribeDisconnected(onDisconnected: Function) {
    const subscription = this.sdk.subscribe(
      'KeyRemoved',
      {contractAddress: this.contractAddress, key: this.publicKey},
      onDisconnected,
    );
    return () => subscription.remove();
  }
}
