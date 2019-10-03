import React from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import {TransferDetails, TokenDetails} from '@universal-login/commons';
import {TransferAmount} from './TransferAmount';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';

export interface ModalTransferAmountProps {
  deployedWallet: DeployedWallet;
  onSelectRecipientClick: () => void;
  updateTransferDetailsWith: (transferDetails: Partial<TransferDetails>) => void;
  token: TokenDetails;
  modalLayoutClassName?: string;
  transferAmountClassName?: string;
}

export const ModalTransferAmount = ({
  deployedWallet,
  onSelectRecipientClick,
  updateTransferDetailsWith,
  token,
  modalLayoutClassName,
  transferAmountClassName
}: ModalTransferAmountProps) => {
  return (
    <div className="universal-login-modal">
      <div className={getStyleForTopLevelComponent(modalLayoutClassName)}>
        <div className="transfer-modal">
          <div className="box-header">
            <h2 className="box-title">Send</h2>
          </div>
          <div className="modal-content">
            <TransferAmount
              deployedWallet={deployedWallet}
              onSelectRecipientClick={onSelectRecipientClick}
              updateTransferDetailsWith={updateTransferDetailsWith}
              token={token}
              transferAmountClassName={transferAmountClassName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

