import {utils} from 'ethers';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {BlockchainService} from '../../integration/ethereum/BlockchainService';
import ObserverBase from './ObserverBase';

const walletContractInterface = new utils.Interface(WalletContract.interface);
const eventInterface = new utils.Interface(WalletContract.interface).events;

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
      const args = walletContractInterface.parseLog(event);
      const {key, purpose} = args.values;
      return {key, purpose: purpose.toNumber()};
    }
    throw `Not supported event with topic: ${event.topics[0]}`;
  }
}

export default BlockchainObserver;
