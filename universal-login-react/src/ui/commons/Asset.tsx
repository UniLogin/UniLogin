import React, {useState, useEffect} from 'react';
import {TokensPrices, TokenDetails} from '@unilogin/commons';
import UniLoginSdk from '@unilogin/sdk';
import Spinner from './Spinner';
import './../styles/base/assetsItem.sass';
import './../styles/themes/UniLogin/assetsItemThemeUnilogin.sass';
import './../styles/themes/Jarvis/assetsItemThemeJarvis.sass';
import './../styles/themes/Legacy/assetsItemThemeLegacy.sass';
import {getTildeGivenAmount, formatCurrency} from '../../core/utils/formatCurrency';
import {ThemedComponent} from './ThemedComponent';
import {Erc20Icon} from './Erc20Icon';
import {formatTokenName} from '../../app/formatTokenName';

export interface AssetProps {
  sdk: UniLoginSdk;
  token: TokenDetails;
  balance: string | null;
}

export const Asset = ({sdk, token, balance}: AssetProps) => {
  const {name, symbol} = token;
  const [usdAmount, setUsdAmount] = useState<string>('');
  const [usdPrice, setUsdPrice] = useState<string>('');

  useEffect(() => {
    const unsubscribe = sdk.subscribeToPrices((tokensPrices: TokensPrices) => {
      const tokenPrice = tokensPrices[symbol] === undefined ? 0 : tokensPrices[symbol]['USD'];
      setUsdPrice(tokenPrice.toString());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const tokenValue = Number(usdPrice) * Number(balance);
    setUsdAmount(tokenValue.toString());
  }, [usdPrice, balance]);

  return (
    <ThemedComponent key={name} name="assets-item">
      <div className="assets-item-row">
        <div className="assets-item-left">
          <div className="assets-img-wrapper">
            <Erc20Icon token={token} className="currency-accordion-img" />
          </div>
          <div>
            <p className="assets-name">{formatTokenName(name)}</p>
            <p className="assets-price">1 {symbol} = ${usdPrice}</p>
          </div>
        </div>
        <div className="assets-item-right">
          {balance ? <p className="assets-balance"> {balance} {symbol}</p> : <Spinner/>}
          <div className="assets-balance-converted">
            <p className="assets-price-tilde">{getTildeGivenAmount(usdAmount)}</p>
            {balance ? <p className="assets-price">{formatCurrency(usdAmount)}</p> : ''}
          </div>

        </div>
      </div>
    </ThemedComponent>
  );
};
