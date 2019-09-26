import React, {useState, useEffect} from 'react';
import {TokensPrices} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import Spinner from './Spinner';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import './../styles/assetsItem.sass';
import './../styles/assetsItemDefault.sass';

export interface AssetProps {
  sdk: UniversalLoginSDK;
  name: string;
  symbol: string;
  balance: string | null;
  icon: string;
  className?: string;
}

export const Asset = ({sdk, name, symbol, balance, icon, className}: AssetProps) => {
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
  }, [usdPrice]);

  return (
    <div key={name} className="universal-login-assets-item">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="assets-item">
          <div className="assets-item-left">
            <div className="assets-img-wrapper">
              <img src={icon} alt={symbol} className="currency-accordion-img" />
            </div>
            <div>
              <p className="assets-name">{name}</p>
              <p className="assets-price">${usdPrice}</p>
            </div>
          </div>
          <div className="assets-item-right">
            {balance ? <p className="assets-balance">{balance} {symbol}</p> : <Spinner/>}
            <p className="assets-price">${usdAmount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
