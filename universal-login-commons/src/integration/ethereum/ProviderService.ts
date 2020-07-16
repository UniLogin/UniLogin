import {providers, utils} from 'ethers';
import {ensure} from '../../core/utils/errors/ensure';
import {fetchHardforkVersion} from './fetchHardforkVersion';
import {NetworkVersion} from '../../core/utils/messages/computeGasData';
import {checkFilter, checkLog, arrayOf} from './ethersUtils';

export interface Filter {
  address?: string | string[];
  fromBlock?: providers.BlockTag;
  toBlock?: providers.BlockTag;
  topics?: Array<string | Array<string>>;
};

export interface FilterByBlock {
  blockHash?: string;
  address?: string | string[];
  topics?: Array<string | Array<string>>;
};

export class ProviderService {
  private cachedContractCodes: Record<string, string> = {};

  constructor(private provider: providers.JsonRpcProvider) {}

  async getCode(contractAddress: string) {
    this.cachedContractCodes[contractAddress] = this.cachedContractCodes[contractAddress] || await this.provider.getCode(contractAddress);
    return this.cachedContractCodes[contractAddress];
  }

  async isContract(address: string) {
    const bytecode = await this.getCode(address);
    ensure(bytecode.length > 0, Error, 'Empty bytecode');
    return bytecode !== '0x';
  }

  getBlockNumber() {
    return this.provider.getBlockNumber();
  }

  async getLogs(filter: Filter | FilterByBlock): Promise<providers.Log[]> {
    const checkedFilter = checkFilter(filter);
    const result = await this.provider.send('eth_getLogs', [checkedFilter]);
    return arrayOf(checkLog)(result);
  }

  on(eventType: providers.EventType, listener: providers.Listener) {
    return this.provider.on(eventType, listener);
  }

  removeListener(eventType: providers.EventType, listener: providers.Listener) {
    return this.provider.removeListener(eventType, listener);
  }

  getEthBalance(walletAddress: string): Promise<utils.BigNumber> {
    return this.provider.getBalance(walletAddress);
  }

  getProvider() {
    return this.provider;
  }

  async fetchHardforkVersion(): Promise<NetworkVersion> {
    return fetchHardforkVersion(this.provider);
  }
}
