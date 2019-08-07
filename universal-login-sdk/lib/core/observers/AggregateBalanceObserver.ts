import {BalanceObserver} from './BalanceObserver';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import {utils} from 'ethers';

export interface PriceOracle {
  getTokenPrice: (tokenSymbol: string) => Promise<number>;
}

export class AggregateBalanceObserver {
  private callbacks: Function[] = [];
  constructor(private balanceObserver: BalanceObserver, private priceOracle: PriceOracle) {}

  subscribe(callback: Function) {
    const unsubscribe = this.balanceObserver.subscribe(callback);
    return unsubscribe;
  }

  async getAggregatedBlanceInUSD(tokensDetailsWithBalance: TokenDetailsWithBalance[]) {
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
