import React from 'react';

export interface TransferAmountProps {
  value: string;
  tokenSymbol: string;
  errors: string [];
  onChange: (value: string) => void;
  onMaxClick: () => void;
}

export const TransferAmount = ({value, tokenSymbol, errors, onChange, onMaxClick}: TransferAmountProps) => {
  return (
    <>
      <div className="transfer-amount-row">
        <label className="transfer-amount-label" htmlFor="amount-eth">Amount</label>
        <button className="transfer-amount-max" onClick={onMaxClick}>Max</button>
      </div>
      <div className="transfer-amount-input-wrapper">
        <div className="transfer-amount-input-content">
          <input
            id="amount-eth"
            type="number"
            className="transfer-amount-input"
            value={value}
            onChange={event => onChange(event.target.value)}
          />
          <span className="transfer-amount-code">{tokenSymbol}</span>
        </div>
        {errors.length > 0 && <div className="hint transfer-amount-hint">{ errors[0] }</div>}
      </div>
    </>
  );
};
