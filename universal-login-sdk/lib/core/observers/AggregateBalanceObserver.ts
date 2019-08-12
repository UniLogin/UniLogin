import {BalanceObserver} from './BalanceObserver';
import {TokenDetailsWithBalance, CurrencyToValue, TokensPrices, TokensValueConverter} from '@universal-login/commons';
import {PriceObserver} from './PriceObserver';

export class AggregateBalanceObserver {
  private tokensPrices: TokensPrices = {};
  private tokenDetailsWithBalance: TokenDetailsWithBalance[] = [];
  private unsubscribePriceObserver?: Function;
  private unsubscribeBalanceObserver?: Function;
  private callbacks: Function[] = [];
  constructor(private balanceObserver: BalanceObserver, private priceObserver: PriceObserver, private tokensValueConverter: TokensValueConverter) {}

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
      }
    };
    return unsubscribe;
  }

  priceObserverCallback(tokensPrices: TokensPrices) {
    this.tokensPrices = tokensPrices;
    this.refreshPrices();
  }

  balanceObserverCallback(tokenDetailsWithBalance: TokenDetailsWithBalance[]) {
    this.tokenDetailsWithBalance = tokenDetailsWithBalance;
    this.refreshPrices();
  }

  refreshPrices() {
    if (!this.tokensPrices || this.tokenDetailsWithBalance.length === 0) {
      return;
    }
    const totalWorth = this.tokensValueConverter.getTotal(this.tokenDetailsWithBalance, this.tokensPrices);
    this.notifyListeners(totalWorth);
  }

  notifyListeners(totalWorth: CurrencyToValue) {
    this.callbacks.forEach((callback) => callback(totalWorth));
  }
}
