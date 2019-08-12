import {utils} from 'ethers';
import {ObservedCurrency, TokensPrices, CurrencyToValue} from '../models/CurrencyData';
import {TokenDetailsWithBalance} from '../models/TokenData';

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
    const temp: any = {};
    Object.keys(tokenPrices).map(
      (symbol) => {
        temp[symbol] = this.safeMultiply(balance, tokenPrices[symbol as ObservedCurrency]);
      }
    );
    return temp;
  }

  safeMultiply(balance: utils.BigNumber, price: number) {
    const priceAsBigNumber = utils.parseUnits(price.toString(), 18);
    const multiplied = priceAsBigNumber.mul(balance);
    return Number(utils.formatUnits(multiplied, 18 + 18));
  }

  addBalances(totalBalances: CurrencyToValue, toAddBalances: CurrencyToValue) {
    for (const key in totalBalances) {
      totalBalances[key as ObservedCurrency] += toAddBalances[key as ObservedCurrency];
    }
    return totalBalances;
  }

  getZeroedBalances() {
    const temp: any = {};
    for (const symbol of this.observedCurrencies) {
      temp[symbol] = 0;
    }
    return temp as CurrencyToValue;
  }
}
