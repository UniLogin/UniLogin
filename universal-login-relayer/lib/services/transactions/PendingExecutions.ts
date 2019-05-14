import PendingExecution from '../../utils/pendingExecution';
import {Message} from '@universal-login/commons';
import {calculateMessageHash} from '@universal-login/contracts';
import {Wallet} from 'ethers';
import {InvalidExecution} from '../../utils/errors';
import PendingExecutionsStore from './PendingExecutionsStore';

export default class PendingExecutions {
  public executionsStore: PendingExecutionsStore;

  constructor(private wallet : Wallet, executionStore: PendingExecutionsStore) {
    this.executionsStore = executionStore;
  }

  isPresent(messageHash : string) {
    return this.executionsStore.isPresent(messageHash);
  }

  private ensureExecutionExist(hash: string) {
    if (!this.isPresent(hash)) {
      throw new InvalidExecution(hash);
    }
  }

  async add(message: Message) : Promise<string> {
    const hash = calculateMessageHash(message);
    if (!this.isPresent(hash)) {
      this.executionsStore.add(hash, new PendingExecution(message.from, this.wallet));
    }
    await this.signExecution(hash, message);
    return hash;
  }

  private async signExecution(hash: string, message: Message) {
    await this.executionsStore.get(hash).push(message);
  }

  async getStatus(hash: string) {
    this.ensureExecutionExist(hash);
    return this.executionsStore.get(hash).getStatus();
  }

  getMessageWithSignatures(message: Message, hash: string) : Message {
    return  { ...message, signature: this.executionsStore.get(hash).getConcatenatedSignatures()};
  }

  async confirmExecution(messageHash: string, transactionHash: string) {
    this.executionsStore.get(messageHash).confirmExecution(transactionHash);
  }

  async ensureCorrectExecution(messageHash: string) {
    this.executionsStore.get(messageHash).ensureCorrectExecution();
  }

  async isEnoughSignatures(hash: string) : Promise<boolean> {
    this.ensureExecutionExist(hash);
    return this.executionsStore.get(hash).isEnoughSignatures();
  }

  get(hash: string) {
    return this.executionsStore.get(hash);
  }
}
