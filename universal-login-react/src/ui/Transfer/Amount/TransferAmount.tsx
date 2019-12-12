import React, {useState} from 'react';
import {TransferDetails, TokenDetails} from '@universal-login/commons';

export interface TransferAmountProps {
  updateTransferDetailsWith: (transferDetails: Partial<TransferDetails>) => void;
  tokenDetails: TokenDetails;
  amountError: boolean;
  setAmountError: (isAmountInvalid: boolean) => void;
  getEtherMaxAmount: () => string;
  transferAmountClassName?: string;
}

export const TransferAmount = ({updateTransferDetailsWith, tokenDetails, amountError, getEtherMaxAmount, setAmountError}: TransferAmountProps) => {
  const [amountValue, setAmountValue] = useState<string>('');

  const onChange = (amount: string) => {
    setAmountError(false);
    setAmountValue(amount);
    updateTransferDetailsWith({amount});
  };

  const onMaxButtonClick = () => {
    const etherMaxAmount = getEtherMaxAmount();
    setAmountValue(etherMaxAmount);
    updateTransferDetailsWith({amount: etherMaxAmount});
  };

  return (
    <>
      <div className="transfer-amount-row">
        <label className="transfer-amount-label" htmlFor="amount-eth">Amount</label>
        <button className="transfer-amount-max" onClick={onMaxButtonClick}>Max</button>
      </div>
      <div className="transfer-amount-input-wrapper">
        <div className="transfer-amount-input-content">
          <input
            id="amount-eth"
            type="number"
            className="transfer-amount-input"
            value={amountValue}
            onChange={event => onChange(event.target.value)}
          />
          <span className="transfer-amount-code">{tokenDetails.symbol}</span>
        </div>
        {amountError && <div className="hint transfer-amount-hint">Invalid amount</div>}
      </div>
    </>
  );
};
