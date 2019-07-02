import {EtherBalanceService} from '../../integration/ethereum/EtherBalanceService';
import {sleep} from '@universal-login/commons';
import {EventEmitter} from 'fbemitter';
import {utils} from 'ethers';

const BALANCE_CHANGED = 'balance_changed';

export class BalanceService {
  private running: boolean = false;
  private emitter = new EventEmitter();
  private lastBalance = utils.bigNumberify(0);
  constructor(private etherBalanceService: EtherBalanceService, private tick: number = 1000) {}

  async loop() {
    while (this.running) {
      const balance = await this.etherBalanceService.getBalance();
      if (!balance.eq(this.lastBalance)) {
        this.lastBalance = balance;
        this.emitter.emit(BALANCE_CHANGED, balance);
      }
      await sleep(this.tick);
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
    const subscription = this.emitter.addListener(BALANCE_CHANGED, callback);
    callback(this.lastBalance);
    return function unsubscribe() {
      subscription.remove();
    };
  }
}
