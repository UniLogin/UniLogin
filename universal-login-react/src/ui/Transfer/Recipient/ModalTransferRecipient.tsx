import React from 'react';
import {TransferDetails} from '@universal-login/commons';
import {TransferRecipient} from './TransferRecipient';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';

export interface ModalTransferRecipientProps {
  onRecipientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendClick: () => Promise<void>;
  onBackClick: () => void;
  symbol: string;
  transferDetails: TransferDetails;
  modalLayoutClassName?: string;
  transferRecipientClassName?: string;
}

export const ModalTransferRecipient = (modalTransferRecipientProps: ModalTransferRecipientProps) => {
  const {modalLayoutClassName, onBackClick, ...transferRecipientProps} = modalTransferRecipientProps;
  return (
    <div className="universal-login-modal">
      <div className={getStyleForTopLevelComponent(modalLayoutClassName)}>
        <div className="transfer-modal">
          <div className="box-header">
            <div className="row align-items-center">
              <button onClick={onBackClick} className="modal-back-btn" />
              <h2 className="box-title">Send</h2>
            </div>
          </div>
          <div className="modal-content">
            <div id="modal-send-recipient">
              <TransferRecipient
                {...transferRecipientProps}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
