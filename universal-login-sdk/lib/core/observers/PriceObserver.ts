const cryptocompare = require('cryptocompare');
import {TokenDetails, ObservedCurrency, TokensPrices} from '@universal-login/commons';
import ObserverRunner from './ObserverRunner';
import {PRICE_OBSERVER_DEAFULT_TICK} from '../../config/observers';

export type OnTokenPricesChange = (data: TokensPrices) => void;

export class PriceObserver extends ObserverRunner {
  private observedTokensSymbols: string[] = [];
  private lastTokenPrices: TokensPrices = {};
  private callbacks: OnTokenPricesChange[] = [];

  constructor(private observedTokens: TokenDetails[], private observedCurrencies: ObservedCurrency[], step: number = PRICE_OBSERVER_DEAFULT_TICK) {
    super();
    this.step = step;
    this.observedTokensSymbols = this.observedTokens.map((token) => token.symbol);
  }

  subscribe(callback: OnTokenPricesChange) {
    this.callbacks.push(callback);

    this.isRunning() ? callback(this.lastTokenPrices) : this.start();

    const unsubscribe = () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
        this.stop();
      }
    };
    return unsubscribe;
  }

  async tick() {
    this.lastTokenPrices = await this.getCurrentPrices();
    this.callbacks.forEach((callback) => callback(this.lastTokenPrices));
  }

  async getCurrentPrices(): Promise<TokensPrices> {
    return cryptocompare.priceMulti(this.observedTokensSymbols, this.observedCurrencies);
  }
}
