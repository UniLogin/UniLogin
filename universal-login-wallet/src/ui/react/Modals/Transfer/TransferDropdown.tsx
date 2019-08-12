import React, {useState} from 'react';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import {useToggler, useServices, useAsyncEffect} from '../../../hooks';
import daiIcon from '../../../assets/icons/dai.svg';
import ethIcon from '../../../assets/icons/ethereum.svg';
import {TransferDropdownItem} from './TransferDropdownItem';
import {utils} from 'ethers';
import {Spinner} from '@universal-login/react';

interface TransferDropdownProps {
  currency: string;
  setCurrency: (currency: string) => void;
}

export const TransferDropdown = ({currency, setCurrency}: TransferDropdownProps) => {
  const {visible, toggle} = useToggler();
  const {sdk, walletPresenter} = useServices();
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);

  useAsyncEffect(() => sdk.subscribeToBalances(walletPresenter.getName(), setTokenDetailsWithBalance), []);

  const onClick = (currency: string) => {
    toggle();
    setCurrency(currency);
  };

  return (
    <div className="currency-accordion">
      {
        tokenDetailsWithBalance
          .filter(({symbol}) => symbol === currency)
          .map(({name, symbol, balance}: TokenDetailsWithBalance) => (
            <TransferDropdownItem
              key={`${name}-${symbol}`}
              className={`currency-accordion-btn currency-accordion-item ${visible ? 'expaned' : ''}`}
              name={name}
              symbol={symbol}
              iconForToken={symbol === 'ETH' ? ethIcon : daiIcon}
              balance={utils.formatEther(balance)}
              onClick={onClick}
            />
          ))}
      }
      {tokenDetailsWithBalance.length === 0 && <div className="currency-accordion-item"> <Spinner /> </div>}
      {
        visible &&
        <div className="currency-accordion-content">
          {tokenDetailsWithBalance
            .filter(({symbol}) => symbol !== currency)
            .map(({name, symbol, balance}: TokenDetailsWithBalance) => (
              <TransferDropdownItem
                key={`${name}-${symbol}`}
                name={name}
                symbol={symbol}
                balance={utils.formatEther(balance)}
                iconForToken={symbol === 'ETH' ? ethIcon : daiIcon}
                onClick={onClick}
              />
            ))}
        </div>
      }
    </div >
  );
};
