import {BalanceObserver} from './BalanceObserver';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import {utils} from 'ethers';
import {} from '@universal-login/commons/lib';

export interface PriceObserver {
  getTokenPrice: (tokenSymbol: string, currencySymbol: string) => Promise<number>;
}

export class AggregateBalanceObserver {
  private tokenPrices: {} = {};
  private tokenDetailsWithBalance: TokenDetailsWithBalance[] = [];
  private unsubscribePriceObserver?: Function;
  private unsubscribeBalanceObserver?: Function;
  private callbacks: Function[] = [];
  constructor(private balanceObserver: BalanceObserver, private priceOracle: PriceOracle) {}

  subscribe(callback: Function, currencySymbol: string) {
    this.callbacks.push(callback);
    if (this.callbacks.length === 1) {
      this.unsubscribeBalanceObserver = this.balanceObserver.subscribe();
      this.unsubscribePriceObserver = this.priceOracle.subscribe();
    }
    const callbackWrapper = async (tokensDetailsWithBalance: TokenDetailsWithBalance[]) => {
      const aggregatedBalance = await this.getAggregatedBalance(tokensDetailsWithBalance, currencySymbol);
      callback(aggregatedBalance);
    };

    const unsubscribe = () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
        this.stop();
        this.lastTokenBalances = [];
      }
    };
    return unsubscribe;
  }

  priceOracleCallback(tokenPrices: {}) {
    this.tokenPrices = tokenPrices;
    this.notfiyWithAggregated
  }

  async getAggregatedBalance(tokensDetailsWithBalance: TokenDetailsWithBalance[], currencySymbol: string) {
    return tokensDetailsWithBalance.reduce(
      async (total, tokenDetails) => (await total + await this.getTokenBalance(tokenDetails, currencySymbol)),
      Promise.resolve(0)
    );
  }

  async getTokenBalance(tokenDetailsWithBalance: TokenDetailsWithBalance, currencySymbol: string) {
    const tokenBalanceInWholeUnits = Number(utils.formatEther(tokenDetailsWithBalance.balance));
    const price = await this.priceObserver.getTokenPrice(tokenDetailsWithBalance.symbol, currencySymbol);
    return tokenBalanceInWholeUnits * price;
  }
}
