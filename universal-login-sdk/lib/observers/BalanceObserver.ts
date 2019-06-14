import {providers, Contract} from 'ethers';
import ObserverBase from './ObserverBase';
import {sleep, SupportedToken, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import ERC20 from '@universal-login/contracts/build/ERC20.json';

const BALANCE_CHANGED = 'balance_changed';

export class BalanceObserver extends ObserverBase {
  constructor(private supportedTokens: any[], private provider: providers.Provider) {
    super();
  }

  tick() {
    return this.doTick();
  }

  subscribeBalanceChanged(contractAddress: string, callback: Function) {
    const listener = this.subscribe(BALANCE_CHANGED, contractAddress, callback);
    return () => listener.remove();
  }

  async doTick() {
    for(const filter of Object.keys(this.emitters)) {
      const [balanceChanged, tokenAddress] = await this.checkBalances(filter);
      if(balanceChanged) {
        this.emitters[filter].emit(BALANCE_CHANGED, tokenAddress)
      }
    }
  }

  async checkBalances(contractAddress: string) {
    for(let count = 0; count < this.supportedTokens.length; count++) {
      const {address, minimalAmount} = this.supportedTokens[count];

      if(address === ETHER_NATIVE_TOKEN.address) {
        return this.etherBalanceChanged(JSON.parse(contractAddress))
      } else {
        const token = new Contract(address, ERC20.interface, this.provider);
        const balance = await token.balanceOf(JSON.parse(contractAddress));
        return [balance.gte(minimalAmount), address];
      }
    }
    return [false, '0x0']
  }

  async etherBalanceChanged(contractAddress, minimalAmount) {
    const balance = await this.provider.getBalance(contractAddress);
    return [balance.gte(minimalAmount), address];
  }

  async tokenBalanceChanged(contractAddress, tokenAddress, minimalAmount) {
    const balance = await this.provider.getBalance(contractAddress);
    return [balance.gte(minimalAmount), address];
  }
}
