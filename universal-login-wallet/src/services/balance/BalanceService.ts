import {EtherBalanceService} from './EtherBalanceService';
import {sleep} from 'universal-login-commons';
import {utils} from 'ethers';

type Callback = (...args: any[]) => any;

export class BalanceService {
  private running: boolean = false;
  constructor(private etherBalanceService: EtherBalanceService, private timeout: number = 1000) {}

  async start(callback: Callback) {
    let lastBalance = undefined;
    while (this.running) {
      const balance = await this.getBalance();
      if (lastBalance !== balance) {
        callback(balance);
        lastBalance = balance;
      }
      await sleep(this.timeout);
    }
  }

  subscribeBalance(callback: Callback) {
    this.running = true;
    this.start(callback);
    return this.unsubscribe.bind(this);
  }

  unsubscribe() {
    this.running = false;
  }

  getBalance = async () =>
    utils.formatEther(await this.etherBalanceService.getBalance())
}
