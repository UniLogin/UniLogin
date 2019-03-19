import {EtherBalanceService} from "./EtherBalanceService";

type Callback = (...args: any[]) => any;

export class BalanceService {
  private running: boolean = false;
  constructor(private etherBalanceService: EtherBalanceService) {}

  async start(callback: Callback) {
    while(this.running) {
      await this.getBalance(callback);
    }
  }

  async subscribeBalance(callback: Callback) {
    this.running = true;
    this.start(callback);
    return () => this.running = false;
  }

  getBalance = async (callback: Callback) => {
    const etherBalance = await this.etherBalanceService.getBalance();
    callback(etherBalance);
    await setTimeout(1000);
  }
}