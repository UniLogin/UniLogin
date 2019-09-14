import {ApplicationWallet, Message} from '@universal-login/commons';
import UniversalLoginSDK from './sdk';
import {Execution} from '../core/services/ExecutionFactory';
import {Contract} from 'ethers';
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
}
