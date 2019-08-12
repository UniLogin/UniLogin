import React, {useState} from 'react';

export interface AmountInputProps {
  amount: string;
  seletedCode: string;
  setCode: (code: string) => void;
  onChange: (amount: string) => void;
}

export const AmountInput = ({amount, seletedCode, setCode, onChange}: AmountInputProps) => {
  const [expanded, setExpanded] = useState(false);
  const codesList = ['GBP', 'EUR', 'PLN'];

  const onCurrencyItemClick = (code: string) => {
    setExpanded(false);
    setCode(code);
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
          {seletedCode}
        </button>
        {expanded &&
          <ul className="amount-dropdown-list">
            {codesList
              .filter(code => code !== seletedCode)
              .map(code => (
                <li key={code}>
                  <button onClick={() => onCurrencyItemClick(code)} className="amount-dropdown-btn">{code}</button>
                </li>
              ))
            }
          </ul>
        }
      </div>
    </div>
  );
};
