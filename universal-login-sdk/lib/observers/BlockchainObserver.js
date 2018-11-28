import {utils, Interface} from 'ethers';
import ObserverBase from './ObserverBase';
import Identity from 'universal-login-contracts/build/Identity';

class BlockchainObserver extends ObserverBase {
  constructor(provider) {
    super();
    this.provider = provider;
    this.eventInterface = new Interface(Identity.interface).events;
    this.codec = new utils.AbiCoder();
  }

  async start() {
    this.lastBlock = await this.provider.getBlockNumber();
    await super.start();
  }

  async tick() {
    await this.fetchEvents();
  }

  async fetchEvents() {
    await this.fetchEventsOfType('KeyAdded');
    await this.fetchEventsOfType('KeyRemoved');
    this.lastBlock = await this.provider.getBlockNumber();
  }

  async fetchEventsOfType(type) {
    const topics = [this.eventInterface[type].topics];
    for (const emitter of Object.keys(this.emitters)) {
      const filter = JSON.parse(emitter);
      const eventsFilter = {fromBlock: this.lastBlock, address: filter.contractAddress, topics};
      const events = await this.provider.getLogs(eventsFilter);
      for (const event of events) {
        const {address} = this.parseArgs(type, event);
        if (filter.key === 'undefined' || filter.key === address) {
          this.emitters[emitter].emit(type, this.parseArgs(type, event));
        } 
      }
    }
  }

  parseArgs(type, event) {
    if (event.topics[0] === this.eventInterface[type].topics[0]) {
      const args = this.eventInterface[type].parse(event.topics, event.data);
      const [address] = this.codec.decode(['address'], args.key);
      const purpose = args.purpose.toNumber();
      const keyType = args.keyType.toNumber();
      return {address, purpose, keyType};
    }
    throw `Not supported event with topic: ${event.topics[0]}`;
  }
}

export default BlockchainObserver;
