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
    for (const contractAddress of Object.keys(this.emitters)) {
      await this.fetchEvents(contractAddress);
    }
  }

  async fetchEvents(contractAddress) {
    await this.fetchEventsOfType('KeyAdded', contractAddress);
    await this.fetchEventsOfType('KeyRemoved', contractAddress);
  }

  async fetchEventsOfType(type, contractAddress) {
    const topics = [this.eventInterface[type].topics];
    const filter = {fromBlock: this.lastBlock, address: contractAddress, topics};
    const events = await this.provider.getLogs(filter);
    for (const event of events) {
      const {address} = this.parseArgs(type, event);
      if (this.emitters[contractAddress][address]) {
        this.emitters[contractAddress][address].emit(type, this.parseArgs(type, event));
      } else {
        this.emitters[contractAddress].emit(type, this.parseArgs(type, event));
      }
    }
    this.lastBlock = await this.provider.getBlockNumber();
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
