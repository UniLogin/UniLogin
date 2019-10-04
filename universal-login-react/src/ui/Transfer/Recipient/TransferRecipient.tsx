import React, {useState} from 'react';
import {TransferDetails, isProperAddress} from '@universal-login/commons';
import './../../styles/transferRecipient.css';
import './../../styles/transferRecipientDefaults.css';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';

export interface TransferRecipientProps {
  symbol: string;
  onRecipientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendClick: () => Promise<void>;
  transferDetails: Partial<TransferDetails>;
  transferRecipientClassName?: string;
}

export const TransferRecipient = ({onRecipientChange, onSendClick, transferRecipientClassName, transferDetails: {amount, to}, symbol}: TransferRecipientProps) => {
  const [showError, setShowError] = useState<boolean>(false);
  const errorMessage = 'Invalid address';

  const onClick = () => isProperAddress(to || '') ? onSendClick() : setShowError(true);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    showError && setShowError(false);
    onRecipientChange(event);
  };

  return (
    <div className="universal-login-recipient">
      <div className={getStyleForTopLevelComponent(transferRecipientClassName)}>
        <div className="transfer-recipient">
          <p className="transfer-recipient-text">To who are you sending {amount} {symbol}?</p>
          <label className="transfer-recipient-label" htmlFor="">Recipient</label>
          <div className="transfer-recipient-input-wrapper">
            <input
              id="input-recipient"
              className="transfer-recipient-input"
              onChange={onChange}
            />
            {showError && <div className="hint">{errorMessage}</div>}
          </div>
          <button id="send-button" onClick={onClick} className="transfer-send-btn">Send</button>
        </div>
      </div>
    </div>
  );
};
