import {utils} from 'ethers';
import {ObservedCurrency, TokensPrices, CurrencyToValue} from '../models/CurrencyData';
import {TokenDetailsWithBalance} from '../models/TokenData';

const SAFE_MULTIPLY_UNITS_NORMALIZE = 18 + 18;
const SAFE_MULTIPLY_UNITS_DENORMALIZE = 18;

export class TokensValueConverter {
  constructor(private observedCurrencies: ObservedCurrency[]) {}

  getTotal(tokensDetailsWithBalance: TokenDetailsWithBalance[], tokensPrices: TokensPrices) {
    const tokensTotalWorth = this.getTokensTotalWorth(tokensDetailsWithBalance, tokensPrices);
    return tokensTotalWorth.reduce(
      (tokensTotal, tokenTotal) =>
        (this.addBalances(tokensTotal, tokenTotal)), this.getZeroedBalances()
      );
  }

  getTokensTotalWorth(tokensDetailsWithBalance: TokenDetailsWithBalance[], tokensPrices: TokensPrices) {
    return tokensDetailsWithBalance.map((token) => this.getTokenTotalWorth(token.balance, tokensPrices[token.symbol]));
  }

  getTokenTotalWorth(balance: utils.BigNumber, tokenPrices: CurrencyToValue) {
    const tokenValues = {} as CurrencyToValue;
    for (const symbol in tokenPrices) {
      tokenValues[symbol as ObservedCurrency] = Number(this.safeMultiply(balance, tokenPrices[symbol as ObservedCurrency]));
    }
    return tokenValues;
  }

  safeMultiply(balance: utils.BigNumber, price: number) {
    const priceAsBigNumber = utils.parseUnits(price.toString(), SAFE_MULTIPLY_UNITS_DENORMALIZE);
    const multiplied = priceAsBigNumber.mul(balance);
    return utils.formatUnits(multiplied, SAFE_MULTIPLY_UNITS_NORMALIZE);
  }

  addBalances(totalBalances: CurrencyToValue, toAddBalances: CurrencyToValue) {
    for (const key in totalBalances) {
      if (key in toAddBalances && typeof toAddBalances[key as ObservedCurrency] === 'number') {
        totalBalances[key as ObservedCurrency] += toAddBalances[key as ObservedCurrency];
      }
    }
    return totalBalances;
  }

  getZeroedBalances() {
    const zeroBalances = {} as CurrencyToValue;
    for (const symbol of this.observedCurrencies) {
      zeroBalances[symbol] = 0;
    }
    return zeroBalances;
  }
}
