import {providers} from 'ethers';
import {fetchHardforkVersion, isContract} from '@unilogin/commons';

export class ProviderService {
  constructor(private provider: providers.Provider) {
  }

  getCode(contractAddress: string) {
    return this.provider.getCode(contractAddress);
  }

  isContract(address: string) {
    return isContract(this.provider, address);
  }

  getBlockNumber() {
    return this.provider.getBlockNumber();
  }

  getLogs(filter: providers.Filter) {
    return this.provider.getLogs(filter);
  }

  on(eventType: providers.EventType, listener: providers.Listener) {
    return this.provider.on(eventType, listener);
  }

  removeListener(eventType: providers.EventType, listener: providers.Listener) {
    return this.provider.removeListener(eventType, listener);
  }

  getProvider() {
    return this.provider;
  }

  async fetchHardforkVersion() {
    return fetchHardforkVersion(this.provider);
  }
}
