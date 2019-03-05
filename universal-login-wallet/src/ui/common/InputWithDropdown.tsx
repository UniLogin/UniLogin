import React from 'react';
import {useToggler} from '../../hooks';

interface InputProps {
  onChange: (...args: any[]) => void;
  onCurrencyChange?: (...args: any[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  id: string;
  currency?: string;
  setCurrency?: (...args: any[]) => void;
  shortcuts: string[];
}

const InputWithDropdown = ({onChange, placeholder, autoFocus, id, className, currency, setCurrency, shortcuts}: InputProps) => {
  const {visible, toggle} = useToggler();
  const onDropdownItemClick = (currency: string) => {
    if (setCurrency) { setCurrency(currency); }
    toggle();
  };

  return (
    <div className="input-dropdown-wrapper">
      <input
        id={id}
        className={`input input-dropdown ${className ? className : ''}`}
        onChange={onChange}
        type="number"
        autoFocus={autoFocus}
        placeholder={placeholder}
      />
      <div className="currency-dropdown">
        <button onClick={toggle} className="currency-dropdown-btn">{currency}</button>
        {visible ?
          <ul className="currency-dropdown-list">
            {shortcuts.map((currency, i) => (
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
