import React from 'react';
import {Input} from '@universal-login/react';
import InputLabel from '../../common/InputLabel';
import TransferDetails from '../../../../core/entities/TransferDetails';
import {TransferDropdown} from './TransferDropdown';

export interface ModalTransferAmountProps {
  onSelectRecipientClick: () => void;
  updateTransferDetailsWith: (transferDetails: Partial<TransferDetails>) => void;
  currency: string;
}

export const ModalTransferAmount = ({onSelectRecipientClick, updateTransferDetailsWith, currency}: ModalTransferAmountProps) => {

  return (
    <div className="transfer-modal">
      <div className="box-header">
        <h2 className="box-title">Send</h2>
      </div>
      <div className="modal-content">

        <div className="transfer-modal-inner">
          <TransferDropdown
            currency={currency}
            setCurrency={(currency: string) => updateTransferDetailsWith({currency})}
          />
          <div className="transfer-modal-row">
            <InputLabel className="transfer-modal-label" htmlFor="amount-eth">How much are you sending?</InputLabel>
            <button className="transfer-max-btn">Max</button>
          </div>
          <div className="transfer-input-wrapper">
            <Input
              id="amount-eth"
              type="number"
              className="transfer-modal-amount"
              onChange={event => updateTransferDetailsWith({amount: event.target.value})}
            />
            <span className="currency-code">ETH</span>
          </div>
          <button id="select-recipient" onClick={onSelectRecipientClick}  className="modal-nav-btn">
            <span>Select recipient</span>
          </button>
        </div>
      </div>
    </div>
  );
};
