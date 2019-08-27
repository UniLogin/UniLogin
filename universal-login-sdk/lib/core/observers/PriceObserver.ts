const cryptocompare = require('cryptocompare');
import {ObservedCurrency, TokensPrices} from '@universal-login/commons';
import ObserverRunner from './ObserverRunner';
import {PRICE_OBSERVER_DEAFULT_TICK} from '../../config/observers';
import {TokensDetailsStore} from '../../integration/ethereum/TokensDetailsStore';

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
    this.lastTokenPrices = await this.getCurrentPrices();
    this.callbacks.forEach((callback) => callback(this.lastTokenPrices));
  }

  async getCurrentPrices(): Promise<TokensPrices> {
    const observedTokensSymbols = this.tokensDetailsStore.tokensDetails.map((token) => token.symbol);
    return cryptocompare.priceMulti(observedTokensSymbols, this.observedCurrencies);
  }
}
