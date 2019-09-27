import {ApplicationWallet, Message, generateBackupCode, walletFromBrain, ETHER_NATIVE_TOKEN, DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT} from '@universal-login/commons';
import UniversalLoginSDK from './sdk';
import {Execution} from '../core/services/ExecutionFactory';
import {Contract, utils} from 'ethers';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {BigNumber} from 'ethers/utils';

export class DeployedWallet implements ApplicationWallet {
  constructor(
    public readonly contractAddress: string,
    public readonly name: string,
    public readonly privateKey: string,
    private readonly sdk: UniversalLoginSDK,
  ) {
  }

  get asApplicationWallet(): ApplicationWallet {
    return {
      contractAddress: this.contractAddress,
      name: this.name,
      privateKey: this.privateKey,
    };
  }

  async addKey(publicKey: string, transactionDetails: Partial<Message>): Promise<Execution> {
    return this.sdk.addKey(this.contractAddress, publicKey, this.privateKey, transactionDetails);
  }

  async addKeys(publicKeys: string[], transactionDetails: Partial<Message>): Promise<Execution> {
    return this.sdk.addKeys(this.contractAddress, publicKeys, this.privateKey, transactionDetails);
  }

  async removeKey(key: string, transactionDetails: Partial<Message>): Promise<Execution> {
    return this.sdk.removeKey(this.contractAddress, key, this.privateKey, transactionDetails);
  }

  async setRequiredSignatures(requiredSignatures: number, transactionDetails: Partial<Message>): Promise<Execution> {
    return this.sdk.setRequiredSignatures(this.contractAddress, requiredSignatures, this.privateKey, transactionDetails);
  }

  async execute(message: Partial<Message>): Promise<Execution> {
    return this.sdk.execute({
      from: this.contractAddress,
      ...message,
    }, this.privateKey);
  }

  async keyExist(key: string) {
    return this.sdk.keyExist(this.contractAddress, key);
  }

  async getNonce() {
    return this.sdk.getNonce(this.contractAddress);
  }

  async getConnectedDevices() {
    return this.sdk.getConnectedDevices(this.contractAddress, this.privateKey);
  }

  async getRequiredSignatures(): Promise<BigNumber> {
    const walletContract = new Contract(this.contractAddress, WalletContract.interface, this.sdk.provider);
    return walletContract.requiredSignatures();
  }

  async generateBackupCodes(): Promise<string[]> {
    const codes: string[] = [generateBackupCode(), generateBackupCode()];
    const addresses: string[] = [];

    for (const code of codes) {
      const {address} = await walletFromBrain(this.name, code);
      addresses.push(address);
    }

    const execution = await this.sdk.addKeys(this.contractAddress, addresses, this.privateKey, {gasToken: ETHER_NATIVE_TOKEN.address, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
    await execution.waitToBeSuccess();
    return codes;
  }

  signMessage(bytes: Uint8Array) {
    const signingKey = new utils.SigningKey(this.privateKey);
    const signature = signingKey.signDigest(utils.hashMessage(bytes));
    return utils.joinSignature(signature);
  }
}
