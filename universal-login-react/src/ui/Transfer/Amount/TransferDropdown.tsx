import React, {useState} from 'react';
import {utils} from 'ethers';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {TransferDropdownItem} from './TransferDropdownItem';
import {useAsyncEffect} from '../../hooks/useAsyncEffect';
import {Spinner} from '../../commons/Spinner';
import daiIcon from '../../assets/icons/dai.svg';
import ethIcon from '../../assets/icons/ethereum.svg';
import {useToggler} from '../../hooks/useToggler';

interface TransferDropdownProps {
  sdk: UniversalLoginSDK;
  ensName: string;
  currency: string;
  setCurrency: (currency: string) => void;
}

export const TransferDropdown = ({sdk, ensName, currency, setCurrency}: TransferDropdownProps) => {
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);
  const {visible, toggle} = useToggler();

  useAsyncEffect(() => sdk.subscribeToBalances(ensName, setTokenDetailsWithBalance), []);

  const onClick = (currency: string) => {
    toggle();
    setCurrency(currency);
  };

  const iconForToken = (symbol: string) => symbol === 'ETH' ? ethIcon : daiIcon;

  return (
    <div className="currency-accordion">
      {
        tokenDetailsWithBalance
          .filter(({symbol}) => symbol === currency)
          .map(({name, symbol, balance}: TokenDetailsWithBalance) => (
            <TransferDropdownItem
              key={`${name}-${symbol}`}
              sdk={sdk}
              className={`currency-accordion-btn currency-accordion-item ${visible ? 'expaned' : ''}`}
              name={name}
              symbol={symbol}
              icon={iconForToken(symbol)}
              balance={utils.formatEther(balance)}
              onClick={onClick}
            />
          ))
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
                sdk={sdk}
                name={name}
                symbol={symbol}
                balance={utils.formatEther(balance)}
                icon={iconForToken(symbol)}
                onClick={onClick}
              />
            ))}
        </div>
      }
    </div >
  );
};
