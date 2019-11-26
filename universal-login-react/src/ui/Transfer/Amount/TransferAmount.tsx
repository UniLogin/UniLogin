import React from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import {TransferDetails, TokenDetails} from '@universal-login/commons';
import {FeatureFlag} from '../../commons/FeatureFlag';

export interface TransferAmountProps {
  deployedWallet: DeployedWallet;
  updateTransferDetailsWith: (transferDetails: Partial<TransferDetails>) => void;
  tokenDetails: TokenDetails;
  amountError: boolean;
  setAmountError: (isAmountInvalid: boolean) => void;
  transferAmountClassName?: string;
}

export const TransferAmount = ({deployedWallet, updateTransferDetailsWith, tokenDetails, amountError, setAmountError}: TransferAmountProps) => {
  const onChange = (amount: string) => {
    setAmountError(false);
    updateTransferDetailsWith({amount});
  };

  return (
    <>
      <label className="transfer-amount-label" htmlFor="amount-eth">Amount</label>
      <FeatureFlag sdk={deployedWallet.sdk} feature="maxButton">
        <button className="transfer-amount-max">Max</button>
      </FeatureFlag>
      <div className="transfer-amount-input-wrapper">
        <div className="transfer-amount-input-content">
          <input
            id="amount-eth"
            type="number"
            className="transfer-amount-input"
            onChange={event => onChange(event.target.value)}
          />
          <span className="transfer-amount-code">{tokenDetails.symbol}</span>
        </div>
        {amountError && <div className="hint transfer-amount-hint">Invalid amount</div>}
      </div>
    </>
  );
};
