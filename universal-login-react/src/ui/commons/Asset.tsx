import React, {useState, useEffect} from 'react';
import {TokensPrices} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';

export interface AssetProps {
  sdk: UniversalLoginSDK;
  name: string;
  symbol: string;
  balance: string;
  icon: string;
}

export const Asset = ({sdk, name, symbol, balance, icon}: AssetProps) => {
  const [usdAmount, setUsdAmount] = useState<string>('');
  const [usdPrice, setUsdPrice] = useState<string>('');

  useEffect(() => {
    const unsubscribe = sdk.subscribeToPrices((tokensPrices: TokensPrices) => {
      const tokenPrice = tokensPrices[symbol] === undefined ? 0 : tokensPrices[symbol]['USD'];
      setUsdPrice(tokenPrice.toString());
      const tokenValue = tokenPrice * Number(balance);
      setUsdAmount(tokenValue.toString());
    });
    return unsubscribe;
  }, []);

  return (
    <li key={`${name}`} className="my-assets-item">
      <div className="my-assets-item-left">
        <div className="my-assets-img-wrapper">
          <img src={icon} alt={symbol} className="currency-accordion-img" />
        </div>
        <div>
          <p className="my-assets-name">{name}</p>
          <p className="my-assets-price">$ {usdPrice}</p>
        </div>
      </div>
      <div className="my-assets-item-right">
        <p className="my-assets-balance">{balance} {symbol}</p>
        <p className="my-assets-price">${usdAmount}</p>
      </div>
    </li>
  );
};
