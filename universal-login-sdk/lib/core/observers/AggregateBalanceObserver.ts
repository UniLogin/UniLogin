import {BalanceObserver} from './BalanceObserver';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import {utils} from 'ethers';

export interface PriceOracle {
  getTokenPrice: (tokenSymbol: string) => Promise<number>;
}

export class AggregateBalanceObserver {
  private callbacks: Function[] = [];
  private unsubscribeBalanceObserver?: Function;
  constructor(private balanceObserver: BalanceObserver, private priceOracle: PriceOracle) {}

  subscribe(callback: Function) {
    this.callbacks.push(callback);
    if (this.callbacks.length === 1) {
      this.unsubscribeBalanceObserver = this.balanceObserver.subscribe(this.callbackWrapper.bind(this));
    }

    return () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
        this.unsubscribeBalanceObserver!();
      }
    };
  }

  async callbackWrapper(tokensDetails: TokenDetailsWithBalance[]) {
    const aggregatedBalanceInUSD = await this.getAggregatedBalanceInUSD(tokensDetails);
    this.callbacks.forEach((callback) => callback(aggregatedBalanceInUSD));
  }

  async getAggregatedBalanceInUSD(tokensDetailsWithBalance: TokenDetailsWithBalance[]) {
    return tokensDetailsWithBalance.reduce(
      async (total, tokenDetails) => (await total + await this.getTokenBalanceInUSD(tokenDetails)),
      Promise.resolve(0)
    );
  }

  async getTokenBalanceInUSD(tokenDetailsWithBalance: TokenDetailsWithBalance) {
    const tokenBalanceInEthOrder = Number(utils.formatEther(tokenDetailsWithBalance.balance));
    const price = await this.priceOracle.getTokenPrice(tokenDetailsWithBalance.symbol);
    return tokenBalanceInEthOrder * price;
  }
}
