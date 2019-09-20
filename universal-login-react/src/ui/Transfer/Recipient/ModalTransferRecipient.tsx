import React from 'react';
import {TransferDetails} from '@universal-login/commons';
import {TransferRecipient} from './TransferRecipient';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';

export interface ModalTransferRecipientProps {
  onRecipientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendClick: () => Promise<void>;
  onBackClick: () => void;
  transferDetails: TransferDetails;
  modalLayoutClassName?: string;
  transferRecipientClassName?: string;
}

export const ModalTransferRecipient = ({
onRecipientChange,
onSendClick,
onBackClick,
modalLayoutClassName,
transferRecipientClassName,
transferDetails
}: ModalTransferRecipientProps) => (
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
              onRecipientChange={onRecipientChange}
              onSendClick={onSendClick}
              transferRecipientClassName={transferRecipientClassName}
              transferDetails={transferDetails}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
