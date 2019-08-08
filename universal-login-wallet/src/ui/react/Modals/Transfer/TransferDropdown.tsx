import React, {useState, useEffect} from 'react';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import {useToggler, useServices} from '../../../hooks';
import {TransferDropdownItem} from './TransferDropdownItem';
import {utils} from 'ethers';

interface TransferDropdownProps {
  currency: string;
  setCurrency: (currency: string) => void;
}

export const TransferDropdown = ({currency, setCurrency}: TransferDropdownProps) => {
  const {visible, toggle} = useToggler();
  const {sdk, walletPresenter} = useServices();
  const [tokenDetailsWithBalanceDetails, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);

  useEffect(() => {
    const promise = sdk.subscribeToBalances(walletPresenter.getName(), setTokenDetailsWithBalance);
    return () => {
      promise.then((unsubscribe: () => void) => unsubscribe());
    };
  }, []);

  const onClick = (currency: string) => {
    toggle();
    setCurrency(currency);
  };

  return (
    <div className="currency-accordion">
      {
        tokenDetailsWithBalanceDetails
          .filter(({symbol}) => symbol === currency)
          .map(({name, symbol, balance}: TokenDetailsWithBalance) => (
            <TransferDropdownItem
              key={`${name}-${symbol}`}
              className={`currency-accordion-btn currency-accordion-item ${visible ? 'expaned' : ''}`}
              name={name}
              symbol={symbol}
              balance={utils.formatEther(balance)}
              onClick={onClick}
            />
          ))}
      }
      {
        visible &&
        <div className="currency-accordion-content">
          {tokenDetailsWithBalanceDetails
            .filter(({symbol}) => symbol !== currency)
            .map(({name, symbol, balance}: TokenDetailsWithBalance) => (
              <TransferDropdownItem key={`${name}-${symbol}`} name={name} symbol={symbol} balance={utils.formatEther(balance)} onClick={onClick} />
            ))}
        </div>
      }
    </div >
  );
};
