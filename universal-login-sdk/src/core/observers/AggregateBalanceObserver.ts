import {BalanceObserver} from './BalanceObserver';
import {TokenDetailsWithBalance, CurrencyToValue, TokensPrices, TokensValueConverter} from '@universal-login/commons';
import {PriceObserver} from './PriceObserver';

export type OnAggregatedBalanceChange = (data: CurrencyToValue) => void;

export class AggregateBalanceObserver {
  private tokensPrices: TokensPrices = {};
  private tokenDetailsWithBalance: TokenDetailsWithBalance[] = [];
  private unsubscribePriceObserver?: () => void;
  private unsubscribeBalanceObserver?: () => void;
  private callbacks: OnAggregatedBalanceChange[] = [];
  constructor(private balanceObserver: BalanceObserver, private priceObserver: PriceObserver, private tokensValueConverter: TokensValueConverter) {}

  subscribe(callback: OnAggregatedBalanceChange) {
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
    if (Object.keys(this.tokensPrices).length === 0 || this.tokenDetailsWithBalance.length === 0) {
      return;
    }
    const totalWorth = this.tokensValueConverter.getTotal(this.tokenDetailsWithBalance, this.tokensPrices);
    this.notifyListeners(totalWorth);
  }

  notifyListeners(totalWorth: CurrencyToValue) {
    this.callbacks.forEach((callback) => callback(totalWorth));
  }
}
