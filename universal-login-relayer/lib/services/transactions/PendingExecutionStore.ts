import PendingExecution from '../../utils/pendingExecution';
import { Message } from '@universal-login/commons';
import {calculateMessageHash} from '@universal-login/contracts';
import { Wallet } from 'ethers';
import { InvalidExecution } from '../../utils/errors';

export default class PendingExecutionStore {
  public executions: Record<string, PendingExecution>;

  constructor(private wallet : Wallet) {
    this.executions = {};
  }

  isPresent(messageHash : string) {
    return messageHash in this.executions;
  }

  async add(message: Message) : Promise<string> {
    const hash = calculateMessageHash(message);
    if (!this.isPresent(hash)) {
      this.executions[hash] = new PendingExecution(message.from, this.wallet);
    }
    await this.signExecution(hash, message);
    return hash;
  }

  private async signExecution(hash: string, message: Message) {
    await this.executions[hash].push(message);
  }

  async getStatus(hash: string) {
    if (!this.isPresent(hash)) {
      throw new InvalidExecution(hash);
    }
    return this.executions[hash].getStatus();
  }

  get(hash: string) {
    return this.executions[hash];
  }

  getWallet() : Wallet {
    return this.wallet;
  }
}
