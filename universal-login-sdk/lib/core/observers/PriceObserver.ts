const cryptocompare = require('cryptocompare');
import {TokenDetails, ObservedCurrency, TokensPrices} from '@universal-login/commons';
import ObserverRunner from './ObserverRunner';
import {PRICE_OBSERVER_DEAFULT_TICK} from '../../config/observers';
import {utils} from 'ethers';
import {TokensPricesNumber, CurrencyToValue, CurrencyToNumberValue} from '@universal-login/commons/lib/core/models/CurrencyData';

export class PriceObserver extends ObserverRunner {
  private observedTokensSymbols: string[] = [];
  private lastTokenPrices: TokensPrices = {};
  private callbacks: Function[] = [];

  constructor(private observedTokens: TokenDetails[], private observedCurrencies: ObservedCurrency[], step: number = PRICE_OBSERVER_DEAFULT_TICK) {
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

  async getCurrentPrices(): Promise<TokensPrices> {
    const pricesWithNumbers = cryptocompare.priceMulti(this.observedTokensSymbols, this.observedCurrencies);
    return this.bigNumberifyTokensPrices(pricesWithNumbers);
  }

  bigNumberifyTokensPrices(tokensPricesNumber: TokensPricesNumber): TokensPrices {
    const tokensPrices: TokensPrices = {};
    for (const tokenSymbol in tokensPricesNumber) {
      tokensPrices[tokenSymbol as ObservedCurrency] = this.bigNumberifyCurrencyToValue(tokensPricesNumber[tokenSymbol as ObservedCurrency]);
    }
    return tokensPrices;
  }

  bigNumberifyCurrencyToValue(tokenPricesNumber: CurrencyToNumberValue): CurrencyToValue {
    const tokenPrices = {} as CurrencyToValue;
    for (const currencySymbol in tokenPricesNumber) {
      tokenPrices[currencySymbol as ObservedCurrency] = utils.bigNumberify(tokenPricesNumber[currencySymbol as ObservedCurrency]);
    }
    return tokenPrices;
  }
}
