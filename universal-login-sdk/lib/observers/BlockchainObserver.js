import {utils} from 'ethers';
import ObserverBase from './ObserverBase';
import Identity from 'universal-login-contracts/build/Identity';

class BlockchainObserver extends ObserverBase {
  constructor(provider) {
    super();
    this.provider = provider;
    this.identityInterface = new utils.Interface(Identity.interface);
    this.eventInterface = new utils.Interface(Identity.interface).events;
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
    const topics = [this.eventInterface[type].topic];
    for (const emitter of Object.keys(this.emitters)) {
      const filter = JSON.parse(emitter);
      const eventsFilter = {fromBlock: this.lastBlock, address: filter.contractAddress, topics};
      const events = await this.provider.getLogs(eventsFilter);
      for (const event of events) {
        const {key} = this.parseArgs(type, event);
        if (filter.key === 'undefined' || filter.key === key) {
          this.emitters[emitter].emit(type, this.parseArgs(type, event));
        } 
      }
    }
  }

  parseArgs(type, event) {
    if (event.topics[0] === this.eventInterface[type].topic) {
      const args = this.identityInterface.parseLog(event);
      const {key, purpose, keyType} = args.values;
      return {key: utils.hexStripZeros(key), keyType: keyType.toNumber(), purpose: purpose.toNumber()};
    }
    throw `Not supported event with topic: ${event.topics[0]}`;
  }
}

export default BlockchainObserver;
