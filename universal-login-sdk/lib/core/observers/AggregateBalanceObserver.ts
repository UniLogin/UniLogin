import {BalanceObserver} from './BalanceObserver';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import {utils} from 'ethers';
import {} from '@universal-login/commons/lib';
import {PriceObserver} from './PriceObserver';
import clonedeep from 'lodash.clonedeep';

export type SymbolToValue = {[symbol: string]: number};

export class AggregateBalanceObserver {
  private tokenPrices: {[symbol: string]: SymbolToValue} = {};
  private tokenDetailsWithBalance: TokenDetailsWithBalance[] = [];
  private unsubscribePriceObserver?: Function;
  private unsubscribeBalanceObserver?: Function;
  private callbacks: Function[] = [];
  constructor(private balanceObserver: BalanceObserver, private priceObserver: PriceObserver) {}

  subscribe(callback: Function) {
    this.callbacks.push(callback);
    if (this.callbacks.length === 1) {
      this.unsubscribeBalanceObserver = this.balanceObserver.subscribe(this.balanceObserverCallback.bind(this));
      this.unsubscribePriceObserver = this.priceObserver.subscribe(this.priceObserverCallback.bind(this));
    }

    const unsubscribe = () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
        this.unsubscribeBalanceObserver!();
        this.unsubscribePriceObserver!();
        this.tokenDetailsWithBalance = [];
        this.tokenPrices = {};
      }
    };
    return unsubscribe;
  }

  priceObserverCallback(tokenPrices: {}) {
    this.tokenPrices = tokenPrices;
    this.notifyListeners();
  }

  balanceObserverCallback(tokenDetailsWithBalance: TokenDetailsWithBalance[]) {
    this.tokenDetailsWithBalance = tokenDetailsWithBalance;
    this.notifyListeners();
  }

  notifyListeners() {
    if (Object.keys(this.tokenPrices).length === 0 || this.tokenDetailsWithBalance.length === 0) {
      return;
    }
    const totalWorth = this.getAggregatedTotalWorth();
    this.callbacks.forEach((callback) => callback(totalWorth));
  }

  getAggregatedTotalWorth() {
    const tokensTotalWorth = this.getTokensTotalWorth(this.tokenDetailsWithBalance);
    return tokensTotalWorth.reduce((tokensTotal, tokenTotal) => (this.addBalances(tokensTotal, tokenTotal)), {});
  }

  getTokensTotalWorth(tokensDetailsWithBalance: TokenDetailsWithBalance[]) {
    return tokensDetailsWithBalance.map((token) => this.getTokenTotalWorth(token));
  }

  getTokenTotalWorth(tokenDetailsWithBalance: TokenDetailsWithBalance) {
    const tokenBalanceInWholeUnits = Number(utils.formatEther(tokenDetailsWithBalance.balance));
    const tokenPrices = this.tokenPrices[tokenDetailsWithBalance.symbol];
    const tokenPricesCopy = clonedeep(tokenPrices);
    Object.keys(tokenPricesCopy).map((symbol) => tokenPricesCopy[symbol] *= tokenBalanceInWholeUnits);
    return tokenPricesCopy;
  }

  addBalances(totalBalances: {[symbol: string]: number}, toAddBalances: {[symbol: string]: number}) {
    const copyTotalBalances = clonedeep(totalBalances);
    Object.keys(toAddBalances).map((symbol: string) => {
      if (copyTotalBalances[symbol] === undefined || copyTotalBalances === null) {
        copyTotalBalances[symbol] = 0;
      }
      copyTotalBalances[symbol] += toAddBalances[symbol];
    });
    return copyTotalBalances;
  }
}
