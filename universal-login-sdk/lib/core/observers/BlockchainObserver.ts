import {WalletContractInterface, BlockchainService} from '@universal-login/contracts';
import ObserverBase from './ObserverBase';

const eventInterface = WalletContractInterface.events;

class BlockchainObserver extends ObserverBase {
  private lastBlock?: number;

  constructor(private blockchainService: BlockchainService) {
    super();
  }

  async start() {
    this.lastBlock = await this.blockchainService.getBlockNumber();
    await super.start();
  }

  async execute() {
    await this.fetchEvents();
  }

  async fetchEvents() {
    await this.fetchEventsOfType('KeyAdded');
    await this.fetchEventsOfType('KeyRemoved');
    this.lastBlock = await this.blockchainService.getBlockNumber();
  }

  async fetchEventsOfType(type: string) {
    const topics = [eventInterface[type].topic];
    for (const emitter of Object.keys(this.emitters)) {
      const filter = JSON.parse(emitter);
      const eventsFilter = {fromBlock: this.lastBlock, address: filter.contractAddress, topics};
      const events = await this.blockchainService.getLogs(eventsFilter);
      for (const event of events) {
        const {key} = this.parseArgs(type, event);
        if (filter.key === 'undefined' || filter.key === key) {
          this.emitters[emitter].emit(type, this.parseArgs(type, event));
        }
      }
    }
  }

  parseArgs(type: string, event: any) {
    if (event.topics[0] === eventInterface[type].topic) {
      const args = WalletContractInterface.parseLog(event);
      const {key} = args.values;
      return {key};
    }
    throw new TypeError(`Not supported event with topic: ${event.topics[0]}`);
  }
}

export default BlockchainObserver;
