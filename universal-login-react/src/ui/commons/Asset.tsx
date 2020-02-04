import React, {useState, useEffect} from 'react';
import {TokensPrices} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import Spinner from './Spinner';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {getTildeGivenAmount, formatCurrency} from '../../core/utils/formatCurrency';
import {useClassFor, classForComponent} from '../utils/classFor';
import './../styles/assetsItem.sass';
import './../styles/assetsItemDefault.sass';
import './../styles/base/assetsItem.sass';
import './../styles/themes/Legacy/assetsItemThemeLegacy.sass';

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
  }, [usdPrice, balance]);

  return (
    <div key={name} className={useClassFor('assets-item-wrapper')}>
      <div className={getStyleForTopLevelComponent(className)}>
        <div className={classForComponent('assets-item')}>
          <div className={classForComponent('assets-item-left')}>
            <div className={classForComponent('assets-img-wrapper')}>
              <img src={icon} alt={symbol} className={classForComponent('currency-accordion-img')} />
            </div>
            <div>
              <p className={classForComponent('assets-name')}>{name}</p>
              <p className={classForComponent('assets-price')}>1 {symbol} = ${usdPrice}</p>
            </div>
          </div>
          <div className={classForComponent('assets-item-right')}>
            {balance ? <p className={classForComponent('assets-balance')}> {balance} {symbol}</p> : <Spinner/>}
            <div className={classForComponent('assets-balance-converted')}>
              <p className={classForComponent('assets-price-tilde')}>{getTildeGivenAmount(usdAmount)}</p>
              <p className={classForComponent('assets-price')}>{formatCurrency(usdAmount)}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
