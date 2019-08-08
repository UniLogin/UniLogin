import React, {useState, useEffect} from 'react';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import daiIcon from '../../../assets/icons/dai.svg';
import ethereumIcon from '../../../assets/icons/ethereum.svg';
import {useToggler, useServices} from '../../../hooks';
import {TransferAccordionItem} from './TransferAccordionItem';
import {utils} from 'ethers';

interface TransferAccordionProps {
  currency: string;
  setCurrency: (currency: string) => void;
}

export const TransferAccordion = ({currency, setCurrency}: TransferAccordionProps) => {
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
            <TransferAccordionItem
              key={`${name}-${symbol}`}
              className={`currency-accordion-btn currency-accordion-item ${visible ? 'expaned' : ''}`}
              name={name}
              symbol={symbol}
              balance={utils.formatEther(balance)}
              iconSrc={ethereumIcon}
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
              <TransferAccordionItem key={`${name}-${symbol}`} iconSrc={daiIcon} name={name} symbol={symbol} balance={utils.formatEther(balance)} onClick={onClick} />
            ))}
        </div>
      }
    </div >
  );
};
