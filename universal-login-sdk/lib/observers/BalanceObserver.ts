import {providers, Contract} from 'ethers';
import ObserverBase from './ObserverBase';
import {SupportedToken, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import ERC20 from '@universal-login/contracts/build/ERC20.json';

const BALANCE_CHANGED = 'balance_changed';

export class BalanceObserver extends ObserverBase {
  constructor(private supportedTokens: SupportedToken[], private provider: providers.Provider) {
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
    for (const contractAddress of Object.keys(this.emitters)) {
      await this.checkBalances(contractAddress);
    }
  }

  async checkBalances(contractAddress: string) {
    for (let count = 0; count < this.supportedTokens.length; count++) {
      const {address, minimalAmount} = this.supportedTokens[count];
      if (address === ETHER_NATIVE_TOKEN.address) {
        await this.etherBalanceChanged(JSON.parse(contractAddress), minimalAmount);
      } else {
        await this.tokenBalanceChanged(JSON.parse(contractAddress), address, minimalAmount);
      }
    }
    return [false, '0x0'];
  }

  async etherBalanceChanged(contractAddress: string, minimalAmount: string) {
    const balance = await this.provider.getBalance(contractAddress);
    if (balance.gte(minimalAmount)) {
      this.onBalanceChanged(contractAddress, ETHER_NATIVE_TOKEN.address);
    }
  }

  async tokenBalanceChanged(contractAddress: string, tokenAddress: string, minimalAmount: string) {
    const token = new Contract(tokenAddress, ERC20.interface, this.provider);
    const balance = await token.balanceOf(contractAddress);
    if (balance.gte(minimalAmount)) {
      this.onBalanceChanged(contractAddress, tokenAddress);
    }
  }

  onBalanceChanged(contractAddress: string, tokenAddress: string) {
    this.emitters[JSON.stringify(contractAddress)].emit(BALANCE_CHANGED, tokenAddress);
  }
}
