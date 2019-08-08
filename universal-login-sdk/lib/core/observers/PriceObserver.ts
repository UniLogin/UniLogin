import {TokenDetails} from '@universal-login/commons';
import ObserverRunner from './ObserverRunner';
const cryptocompare = require('cryptocompare');

export type ObservedCurrency = 'USD' | 'EUR' | 'BTC';

export class PriceObserver extends ObserverRunner {
  private observedTokensSymbols: string[] = [];
  private lastTokenPrices: {} = {};
  private callbacks: Function[] = [];

  constructor(private observedTokens: TokenDetails[], private observedCurrencies: ObservedCurrency[], step: number = 1000 * 60) {
    super();
    this.step = step;
    this.observedTokensSymbols = this.observedTokens.map((token) => token.symbol);
  }

  subscribe(callback: Function) {
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

  async getCurrentPrices() {
    return cryptocompare.priceMulti(this.observedTokensSymbols, this.observedCurrencies);
  }
}
