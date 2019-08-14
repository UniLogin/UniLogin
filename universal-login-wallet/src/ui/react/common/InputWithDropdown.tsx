import React from 'react';
import {classesForElement} from '@universal-login/commons';
import {useToggler} from '@universal-login/react';
import {useServices} from '../../hooks';

interface InputProps {
  onChange: (...args: any[]) => void;
  onCurrencyChange?: (...args: any[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  id: string;
  currency?: string;
  setCurrency?: (...args: any[]) => void;
}

const classesForInputWithDropdown = classesForElement('input', 'input-with-dropdown');

const InputWithDropdown = ({onChange, placeholder, autoFocus, id, className, currency, setCurrency}: InputProps) => {
  const {visible, toggle} = useToggler();
  const {sdk} = useServices();
  const symbols = sdk.tokensDetailsStore.tokensDetails.map(element => element.symbol);
  const onDropdownItemClick = (currency: string) => {
    if (setCurrency) { setCurrency(currency); }
    toggle();
  };

  return (
    <div className="input-dropdown-wrapper">
      <input
        id={id}
        className={classesForInputWithDropdown(className)}
        onChange={onChange}
        type="number"
        autoFocus={autoFocus}
        placeholder={placeholder}
      />
      <div className="currency-dropdown">
        <button onClick={toggle} className="currency-dropdown-btn">{currency}</button>
        {visible ?
          <ul className="currency-dropdown-list">
            {symbols.map((currency, i) => (
              <li key={i} className="currency-item">
                <button className="currency-item-btn" onClick={() => onDropdownItemClick(currency)}>
                  {currency}
                </button>
              </li>
            ))}
         </ul>
         : null
        }
      </div>
    </div>
  );
};

export default InputWithDropdown;
