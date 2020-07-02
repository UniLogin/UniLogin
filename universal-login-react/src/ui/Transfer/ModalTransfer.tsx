import React from 'react';
import {Transfer, TransferProps} from './Transfer';

export const ModalTransfer = ({...transferProps}: TransferProps) => {
  return (
    <div className="universal-login-modal">
      <div className="transfer-modal">
        <div className="box-header">
          <h2 className="box-title">Send</h2>
        </div>
        <Transfer
          {...transferProps}
        />
      </div>
    </div>
  );
};
