import React from 'react';
import {TransferDropdown} from './TransferDropdown';
import UniversalLoginSDK from '@universal-login/sdk';
import {TransferDetails} from '@universal-login/commons';
import './../../styles/transferAmount.css';
import './../../styles/transferAmountDefaults.css';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';

export interface TransferAmountProps {
  sdk: UniversalLoginSDK;
  ensName: string;
  onSelectRecipientClick: () => void;
  updateTransferDetailsWith: (transferDetails: Partial<TransferDetails>) => void;
  currency: string;
  transferAmountClassName?: string;
}

export const TransferAmount = ({sdk, ensName, onSelectRecipientClick, updateTransferDetailsWith, currency, transferAmountClassName}: TransferAmountProps) => (
  <div className="universal-login-amount">
    <div className={getStyleForTopLevelComponent(transferAmountClassName)}>
      <div className="transfer-amount">
        <TransferDropdown
          sdk={sdk}
          ensName={ensName}
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
            onChange={event => updateTransferDetailsWith({amount: event.target.value})}
          />
          <span className="transfer-amount-code">{currency}</span>
        </div>
        <button id="select-recipient" onClick={onSelectRecipientClick} className="transfer-amount-btn">
          <span>Select recipient</span>
        </button>
      </div>
    </div>
  </div>
);
