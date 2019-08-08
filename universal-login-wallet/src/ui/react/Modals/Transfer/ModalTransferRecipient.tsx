import React from 'react';
import InputLabel from '../../common/InputLabel';
import {Input} from '@universal-login/react';

export interface ModalTransferRecipientProps {
  onRecipientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendClick: () => Promise<void>;
  onBackClick: () => void;
}

export const ModalTransferRecipient = ({onRecipientChange, onSendClick, onBackClick}: ModalTransferRecipientProps) => (
  <div className="transfer-modal">
    <div className="box-header">
      <div className="row align-items-center">
        <button onClick={onBackClick} className="modal-back-btn" />
        <h2 className="box-title">Send</h2>
      </div>
    </div>
    <div className="modal-content">
      <div id="modal-send-recipient" className="recipient-modal-inner">
        <p className="recipient-modal-text">To who  are you sending 1.2 ETH?</p>
        <InputLabel htmlFor="">Recipient</InputLabel>
        <div className="recipient-input-wrapper">
          <Input
            id="input-recipient"
            className="recipient-input"
            onChange={onRecipientChange}
          />
        </div>
        <button id="send-button" onClick={onSendClick} className="button-primary">Send</button>
      </div>
    </div>
  </div>
);
