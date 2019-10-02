import React, {useState} from 'react';
import {TransferDropdown} from './TransferDropdown';
import UniversalLoginSDK from '@universal-login/sdk';
import {TransferDetails, TokenDetailsWithBalance, getBalanceOf} from '@universal-login/commons';
import './../../styles/transferAmount.css';
import './../../styles/transferAmountDefaults.css';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import {useAsyncEffect} from '../../hooks/useAsyncEffect';

export interface TransferAmountProps {
  sdk: UniversalLoginSDK;
  contractAddress: string;
  onSelectRecipientClick: () => void;
  updateTransferDetailsWith: (transferDetails: Partial<TransferDetails>) => void;
  currency: string;
  transferAmountClassName?: string;
}

export const TransferAmount = ({sdk, contractAddress, onSelectRecipientClick, updateTransferDetailsWith, currency, transferAmountClassName}: TransferAmountProps) => {
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);
  const [isAmountCorrect, setIsAmountCorrect] = useState(false);

  useAsyncEffect(() => sdk.subscribeToBalances(contractAddress, setTokenDetailsWithBalance), []);
  const balance = getBalanceOf(currency, tokenDetailsWithBalance);

  const validateAndUpdateTransferDetails = (amount: string) => {
    if (balance && amount) {
      setIsAmountCorrect(amount <= balance);
    } else {
      setIsAmountCorrect(false);
    }
    updateTransferDetailsWith({amount});
  };

  return (
    <div className="universal-login-amount">
    <div className={getStyleForTopLevelComponent(transferAmountClassName)}>
      <div className="transfer-amount">
        <TransferDropdown
          sdk={sdk}
          tokenDetailsWithBalance={tokenDetailsWithBalance}
          currency={currency}
          setCurrency={(currency: string) => updateTransferDetailsWith({currency})}
          className={transferAmountClassName}
        />
        <div className="transfer-amount-row">
          <label className="transfer-amount-label" htmlFor="amount-eth">How much are you sending?</label>
          <button className="transfer-amount-max">Max</button>
        </div>
        <div className="transfer-amount-input-wrapper">
          <input
            id="amount-eth"
            type="number"
            className="transfer-amount-input"
            onChange={event => validateAndUpdateTransferDetails(event.target.value)}
          />
          <span className="transfer-amount-code">{currency}</span>
        </div>
        <button id="select-recipient" onClick={onSelectRecipientClick} className="transfer-amount-btn" disabled={!isAmountCorrect}>
          <span>Select recipient</span>
        </button>
      </div>
    </div>
  </div>
  );
};
