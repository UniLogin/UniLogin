import React from 'react';
import {Transfer, TransferProps} from './Transfer';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

export interface ModalTransferProps extends TransferProps {
  modalLayoutClassName?: string;
}

export const ModalTransfer = ({
  modalLayoutClassName,
  ...transferProps
}: ModalTransferProps) => {
  return (
    <div className="universal-login-modal">
      <div className={getStyleForTopLevelComponent(modalLayoutClassName)}>
        <div className="transfer-modal">
          <div className="box-header">
            <h2 className="box-title">Send</h2>
          </div>
          <Transfer
            {...transferProps}
          />
        </div>
      </div>
    </div>
  );
};
