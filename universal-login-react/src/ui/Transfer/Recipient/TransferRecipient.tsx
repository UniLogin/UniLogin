import React from 'react';
import {Warning} from '../../commons/Warning';
import {TRANSFER_WARNING} from '../../../core/constants/transferWarningMessage';

export interface TransferRecipientProps {
  onChange: (recipient: string) => void;
  errors: string[];
}

export const TransferRecipient = ({onChange, errors}: TransferRecipientProps) => {
  return (
    <>
      <div className="transfer-recipient-row">
        <label className="transfer-recipient-label" htmlFor="input-recipient">Recipient</label>
      </div>
      <div className="transfer-recipient-input-wrapper">
        <div className="transfer-recipient-input-content">
          <input
            id="input-recipient"
            className="transfer-recipient-input"
            onChange={event => onChange(event.target.value)}
          />
        </div>
        {errors.length > 0 && <div className="hint transfer-recipient-hint">{errors[0]}</div>}
        <Warning message={TRANSFER_WARNING} />
      </div>
    </>
  );
};
