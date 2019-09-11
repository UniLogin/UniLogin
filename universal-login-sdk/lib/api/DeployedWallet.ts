import {ApplicationWallet, Message} from '@universal-login/commons';
import UniversalLoginSDK from './sdk';
import {Execution} from '../core/services/ExecutionFactory';

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

  async addKey(publicKey: string, transactionDetails: Message) {
    return this.sdk.addKey(this.contractAddress, publicKey, this.privateKey, transactionDetails);
  }

  async addKeys(publicKeys: string[], transactionDetails: Message) {
    return this.sdk.addKeys(this.contractAddress, publicKeys, this.privateKey, transactionDetails);
  }

  async removeKey(key: string, transactionDetails: Message) {
    return this.sdk.removeKey(this.contractAddress, key, this.privateKey, transactionDetails);
  }

  async setRequiredSignatures(requiredSignatures: number, transactionDetails: Message) {
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
}
