import PendingExecution from '../../utils/pendingExecution';
import {SignedMessage} from '@universal-login/commons';
import {calculateMessageHash} from '@universal-login/contracts';
import {Wallet} from 'ethers';
import {InvalidExecution} from '../../utils/errors';
import IPendingExecutionsStore from './IPendingExecutionsStore';

export default class PendingMessages {

  constructor(private wallet : Wallet, private executionsStore: IPendingExecutionsStore) {
  }

  isPresent(messageHash : string) {
    return this.executionsStore.isPresent(messageHash);
  }

  private ensureExecutionExist(hash: string) {
    if (!this.isPresent(hash)) {
      throw new InvalidExecution(hash);
    }
  }

  async add(message: SignedMessage) : Promise<string> {
    const hash = calculateMessageHash(message);
    if (!this.isPresent(hash)) {
      this.executionsStore.add(hash, new PendingExecution(message.from, this.wallet));
    }
    await this.signExecution(hash, message);
    return hash;
  }

  private async signExecution(hash: string, message: SignedMessage) {
    await this.executionsStore.get(hash).push(message);
  }

  async getStatus(hash: string) {
    this.ensureExecutionExist(hash);
    return this.executionsStore.get(hash).getStatus();
  }

  getMessageWithSignatures(message: SignedMessage, hash: string) : SignedMessage {
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

  remove(hash: string) {
    return this.executionsStore.remove(hash);
  }
}
