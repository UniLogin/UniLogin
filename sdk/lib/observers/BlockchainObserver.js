import ObserverBase from './ObserverBase';

class BlockchainObserver extends ObserverBase {
  constructor(provider) {
    super();
    this.provider = provider;
  }
}

export default BlockchainObserver;
