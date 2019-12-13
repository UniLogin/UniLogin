import React from 'react';

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
        {errors.length > 0 && <div className="hint transfer-recipient-hint">Invalid recipient</div>}
      </div>
    </>
  );
};
