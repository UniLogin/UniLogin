import {providers, utils, Contract} from 'ethers';
import {ensure} from '../../core/utils/errors/ensure';
import {InvalidContract} from '../../core/utils/errors/errors';
import {ETHER_NATIVE_TOKEN} from '../../core/constants/constants';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {fetchHardforkVersion} from './fetchHardforkVersion';

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

  getBalance(walletAddress: string, tokenAddress: string): Promise<utils.BigNumber> {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return this.getEthBalance(walletAddress);
    }
    return this.getTokenBalance(walletAddress, tokenAddress);
  }

  private getEthBalance(walletAddress: string): Promise<utils.BigNumber> {
    return this.provider.getBalance(walletAddress);
  }

  private async getTokenBalance(walletAddress: string, tokenAddress: string): Promise<utils.BigNumber> {
    ensure(await this.isContract(tokenAddress), InvalidContract, tokenAddress);
    const token = new Contract(tokenAddress, IERC20.abi, this.provider);
    return token.balanceOf(walletAddress);
  }

  getProvider() {
    return this.provider;
  }

  async fetchHardforkVersion() {
    return fetchHardforkVersion(this.provider);
  }
}
