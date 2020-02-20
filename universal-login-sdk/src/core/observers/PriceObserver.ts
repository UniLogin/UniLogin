import {ObservedCurrency, TokensPrices} from '@unilogin/commons';
import ObserverRunner from './ObserverRunner';
import {TokensDetailsStore} from '../services/TokensDetailsStore';
import {getPrices} from '../../integration/http/cryptocompare';
const deepEqual = require('deep-equal');
const cloneDeep = require('lodash.clonedeep');

export type OnTokenPricesChange = (data: TokensPrices) => void;

export class PriceObserver extends ObserverRunner {
  private lastTokenPrices: TokensPrices = {};
  private callbacks: OnTokenPricesChange[] = [];

  constructor(private tokensDetailsStore: TokensDetailsStore, private observedCurrencies: ObservedCurrency[], tick: number) {
    super();
    this.tick = tick;
  }

  subscribe(callback: OnTokenPricesChange) {
    this.callbacks.push(callback);

    if (this.isStopped()) {
      this.start();
    }
    callback(this.lastTokenPrices);

    const unsubscribe = () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
        this.lastTokenPrices = {};
        this.stop();
      }
    };
    return unsubscribe;
  }

  async execute() {
    await this.checkTokenPricesNow();
  }

  async checkTokenPricesNow() {
    const newTokenPrices = await this.getCurrentPrices();
    if (!(deepEqual(this.lastTokenPrices, newTokenPrices))) {
      this.lastTokenPrices = cloneDeep(newTokenPrices);
      this.callbacks.forEach((callback) => callback(this.lastTokenPrices));
    }
  }

  getCurrentPrices(): Promise<TokensPrices> {
    const observedTokensSymbols = this.tokensDetailsStore.tokensDetails.map((token) => token.symbol);
    return getPrices(observedTokensSymbols, this.observedCurrencies);
  }
}
