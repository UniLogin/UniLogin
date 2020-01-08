import React from 'react';
import '../styles/confirmation.css';
import {ModalWrapper} from '@universal-login/react';

export interface ConfirmationProps {
  onConfirmationResponse: (response: boolean) => void;
}

export const Confirmation = ({onConfirmationResponse}: ConfirmationProps) =>
  <ModalWrapper>
    <div className="confirmation-box">
      <h2 className="confirmation-title">Confirmation</h2>
      <div className="confirmation-message">Please confirm your action</div>
      <div className="confirmation-buttons-container">
        <button className="confirmation-button primary" onClick={() => onConfirmationResponse(true)}>Confirm</button>
        <button className="confirmation-button secondary" onClick={() => onConfirmationResponse(false)}>Cancel</button>
      </div>
    </div>
  </ModalWrapper>;
