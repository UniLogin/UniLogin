import React, {useState} from 'react';
import {useClassFor, classForComponent} from '../../utils/classFor';
import './../../styles/base/components/amountSelect.sass';
import './../../styles/themes/UniLogin/components/amountSelectThemeUniLogin.sass';
import {Label} from '../../commons/Form/Label';
import {WalletService} from '@unilogin/sdk';
import {ensureNotFalsy} from '@unilogin/commons';
import {MissingParameter} from '../../../core/utils/errors';

export interface AmountInputProps {
  amount: string;
  selectedCurrency: string;
  setCurrency: (currency: string) => void;
  onChange: (amount: string) => void;
  isDeployment?: boolean;
  walletService?: WalletService;
}

const REGULAR_CURRENCIES_LIST = ['ETH', 'DAI'];

export const AmountInput = ({amount, isDeployment, selectedCurrency, setCurrency, onChange, walletService}: AmountInputProps) => {
  const [expanded, setExpanded] = useState(false);
  if (isDeployment) {
    ensureNotFalsy(walletService, MissingParameter, 'wallet service');
  }
  const currenciesList = isDeployment && walletService ? [walletService.getFutureWallet().getTopUpCurrencySymbol()] : REGULAR_CURRENCIES_LIST;
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
