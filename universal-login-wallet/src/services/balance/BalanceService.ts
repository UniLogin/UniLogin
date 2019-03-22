import {EtherBalanceService} from './EtherBalanceService';
import {sleep, Procedure} from 'universal-login-commons';

export class BalanceService {
  private running: boolean = false;
  constructor(private etherBalanceService: EtherBalanceService, private timeout: number = 1000) {}

  async start(callback: Procedure) {
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

  subscribeBalance(callback: Procedure) {
    this.running = true;
    this.start(callback);
    return this.unsubscribe.bind(this);
  }

  unsubscribe() {
    this.running = false;
  }

  getBalance = async () =>
    await this.etherBalanceService.getBalance()
}
