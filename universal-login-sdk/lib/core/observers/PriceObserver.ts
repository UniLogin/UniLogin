const cryptocompare = require('cryptocompare');
import {ObservedCurrency, TokensPrices} from '@universal-login/commons';
import ObserverRunner from './ObserverRunner';
import {PRICE_OBSERVER_DEAFULT_TICK} from '../../config/observers';
import {TokensDetailsStore} from '../../integration/ethereum/TokensDetailsStore';

export class PriceObserver extends ObserverRunner {
  private lastTokenPrices: TokensPrices = {};
  private callbacks: Function[] = [];

  constructor(private tokensDetailsStore: TokensDetailsStore, private observedCurrencies: ObservedCurrency[], step: number = PRICE_OBSERVER_DEAFULT_TICK) {
    super();
    this.step = step;
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

  async getCurrentPrices(): Promise<TokensPrices> {
    if (this.tokensDetailsStore.tokensDetails.length === 0) {
      await this.tokensDetailsStore.fetchTokensDetails();
    }
    const observedTokensSymbols = this.tokensDetailsStore.tokensDetails.map((token) => token.symbol);
    return cryptocompare.priceMulti(observedTokensSymbols, this.observedCurrencies);
  }
}
