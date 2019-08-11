import {BalanceObserver} from './BalanceObserver';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import {utils} from 'ethers';

export interface PriceObserver {
  getTokenPrice: (tokenSymbol: string, currencySymbol: string) => Promise<number>;
}

export class AggregateBalanceObserver {
  constructor(private balanceObserver: BalanceObserver, private priceObserver: PriceObserver) {}

  subscribe(callback: Function, currencySymbol: string) {
    const callbackWrapper = async (tokensDetailsWithBalance: TokenDetailsWithBalance[]) => {
      const aggregatedBalance = await this.getAggregatedBalance(tokensDetailsWithBalance, currencySymbol);
      callback(aggregatedBalance);
    };

    return this.balanceObserver.subscribe(callbackWrapper.bind(this));
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
