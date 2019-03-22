import {EtherBalanceService} from './EtherBalanceService';
import {sleep} from 'universal-login-commons';
import {EventEmitter} from 'fbemitter';
import {utils} from 'ethers';

const BALANCE_EVENT = 'balance';

export class BalanceService {

  private running: boolean = false;
  private emitter = new EventEmitter();
  constructor(private etherBalanceService: EtherBalanceService, private timeout: number = 1000) {}

  async loop() {
    while (this.running) {
      const balance = await this.getBalance();
      this.emitter.emit(BALANCE_EVENT, balance);
      await sleep(this.timeout);
    }
  }

  start() {
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
  }

  subscribe(callback: (balance: utils.BigNumber) => void) {
    const subscription = this.emitter.addListener(BALANCE_EVENT, callback);
    return function unsubscribe() {
      subscription.remove();
    }
  }

  getBalance = async () =>
    await this.etherBalanceService.getBalance()
}
