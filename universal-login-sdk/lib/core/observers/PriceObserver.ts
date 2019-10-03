const cryptocompare = require('cryptocompare');
import {ObservedCurrency, TokensPrices} from '@universal-login/commons';
import ObserverRunner from './ObserverRunner';
import {PRICE_OBSERVER_DEAFULT_TICK} from '../../config/observers';
import {TokensDetailsStore} from '../services/TokensDetailsStore';
import deepEqual = require('deep-equal');
import cloneDeep = require('lodash.clonedeep');

export type OnTokenPricesChange = (data: TokensPrices) => void;

export class PriceObserver extends ObserverRunner {
  private lastTokenPrices: TokensPrices = {};
  private callbacks: OnTokenPricesChange[] = [];

  constructor(private tokensDetailsStore: TokensDetailsStore, private observedCurrencies: ObservedCurrency[], tick: number = PRICE_OBSERVER_DEAFULT_TICK) {
    super();
    this.tick = tick;
  }

  subscribe(callback: OnTokenPricesChange) {
    this.callbacks.push(callback);

    this.isStopped() ? this.start() : callback(this.lastTokenPrices);

    const unsubscribe = () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
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

  async getCurrentPrices(): Promise<TokensPrices> {
    const observedTokensSymbols = this.tokensDetailsStore.tokensDetails.map((token) => token.symbol);
    return cryptocompare.priceMulti(observedTokensSymbols, this.observedCurrencies);
  }
}
