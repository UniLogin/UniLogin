import React, {useState} from 'react';
import {useClassFor, classForComponent} from '../../utils/classFor';
import './../../styles/base/components/amountSelect.sass';
import './../../styles/themes/UniLogin/components/amountSelectThemeUniLogin.sass';
import {Label} from '../../commons/Form/Label';
import {WalletService} from '@unilogin/sdk';

export interface AmountInputProps {
  amount: string;
  selectedCurrency: string;
  setCurrency: (currency: string) => void;
  onChange: (amount: string) => void;
  walletService: WalletService;
  regularCurrenciesList: string[];
}

export const AmountInput = ({amount, selectedCurrency, setCurrency, onChange, walletService, regularCurrenciesList}: AmountInputProps) => {
  const [expanded, setExpanded] = useState(false);
  const isDeployment = !walletService.walletDeployed.get();
  const currenciesList = isDeployment ? [walletService.getFutureWallet().getTopUpCurrencySymbol()] : regularCurrenciesList;
  const disabled = currenciesList.length < 2;

  const onCurrencyItemClick = (currency: string) => {
    setExpanded(false);
    setCurrency(currency);
  };

  return (
    <>
      <Label>Amount</Label>
      <div className={useClassFor('amount-input-wrapper')}>
        <input
          value={amount}
          type="number"
          className={classForComponent('amount-input')}
          onChange={event => onChange(event.target.value)}
        />
        <div className={classForComponent('amount-dropdown')}>
          <button
            className={`${classForComponent('amount-dropdown-btn')} ${disabled ? '' : classForComponent('amount-dropdown-toggle')} ${expanded ? 'expanded' : ''}`}
            onClick={() => setExpanded(!expanded)}
          >
            {selectedCurrency}
          </button>
          {expanded &&
            <ul className={classForComponent('amount-dropdown-list')}>
              {currenciesList
                .filter(currency => currency !== selectedCurrency)
                .map(currency => (
                  <li key={currency}>
                    <button onClick={() => onCurrencyItemClick(currency)} className={classForComponent('amount-dropdown-btn')}>{currency}</button>
                  </li>
                ))
              }
            </ul>
          }
        </div>
      </div>
    </>
  );
};
