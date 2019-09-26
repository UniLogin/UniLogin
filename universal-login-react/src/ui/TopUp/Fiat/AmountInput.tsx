import React, {useState} from 'react';

export interface AmountInputProps {
  amount: string;
  selectedCurrency: string;
  setCurrency: (currency: string) => void;
  onChange: (amount: string) => void;
}

export const AmountInput = ({amount, selectedCurrency, setCurrency, onChange}: AmountInputProps) => {
  const [expanded, setExpanded] = useState(false);
  const currenciesList = ['GBP', 'EUR', 'PLN', 'USD'];

  const onCurrencyItemClick = (currency: string) => {
    setExpanded(false);
    setCurrency(currency);
  };

  return (
    <div className="amount-input-wrapper">
      <input
        value={amount}
        type="number"
        className="amount-input"
        onChange={event => onChange(event.target.value)}
      />
      <div className="amount-dropdown">
        <button
          className={`amount-dropdown-btn amount-dropdown-toggle ${expanded ? 'expanded' : ''}`}
          onClick={() => setExpanded(!expanded)}
        >
          {selectedCurrency}
        </button>
        {expanded &&
          <ul className="amount-dropdown-list">
            {currenciesList
              .filter(currency => currency !== selectedCurrency)
              .map(currency => (
                <li key={currency}>
                  <button onClick={() => onCurrencyItemClick(currency)} className="amount-dropdown-btn">{currency}</button>
                </li>
              ))
            }
          </ul>
        }
      </div>
    </div>
  );
};
