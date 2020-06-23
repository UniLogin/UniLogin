import {providers} from 'ethers';
import {ensure} from '@unilogin/commons';

export const ISTANBUL_BLOCK_NUMBER = 9069000;

export class ProviderService {
  constructor(private provider: providers.Provider) {
  }

  getCode(contractAddress: string) {
    return this.provider.getCode(contractAddress);
  }

  async isContract(address: string) {
    const bytecode = await this.getCode(address);
    ensure(bytecode.length > 0, Error, 'Empty bytecode');
    return bytecode !== '0x';
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
    const {name} = await this.provider.getNetwork();
    switch (name) {
      case 'kovan':
        return 'istanbul';
      case 'ropsten':
        return 'istanbul';
      case 'rinkeby':
        return 'istanbul';
      case 'unknown':
        return 'constantinople';
      case 'ganache':
        return 'constantinople';
      case 'homestead':
      case 'mainnet':
        const blockNumber = await this.provider.getBlockNumber();
        if (blockNumber < ISTANBUL_BLOCK_NUMBER) {
          return 'constantinople';
        }
        return 'istanbul';
      default:
        throw TypeError(`Invalid network: ${name}`);
    }
  }
}
