import React from 'react';
import {TransferDetails} from '@universal-login/commons';
import './../../styles/transferRecipient.css';
import './../../styles/transferRecipientDefaults.css';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';

export interface TransferRecipientProps {
  onRecipientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendClick: () => Promise<void>;
  transferDetalis: TransferDetails;
  transferRecipientClassName?: string;
}

export const TransferRecipient = ({onRecipientChange, onSendClick, transferRecipientClassName, transferDetalis: {amount, currency}}: TransferRecipientProps) => (
  <div className="universal-login-recipient">
    <div className={getStyleForTopLevelComponent(transferRecipientClassName)}>
      <div className="transfer-recipient">
        <p className="transfer-recipient-text">To who  are you sending {amount} {currency}?</p>
          <label className="transfer-recipient-label" htmlFor="">Recipient</label>
          <div className="transfer-recipient-input-wrapper">
            <input
              id="input-recipient"
              className="transfer-recipient-input"
              onChange={onRecipientChange}
            />
          </div>
        <button id="send-button" onClick={onSendClick} className="transfer-send-btn">Send</button>
      </div>
    </div>
  </div>
);
