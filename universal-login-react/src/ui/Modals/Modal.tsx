import React from 'react';
import {TopUp} from '../TopUp/TopUp';
import {ModalWrapper} from './ModalWrapper';
import {WalletService} from '@universal-login/sdk';
import ModalService from '../../core/services/ModalService';
import WaitingFor from '../commons/WaitingFor'

export interface ModalProps {
  modalService: ModalService;
  modalClassName?: string;
  walletService: WalletService
}

const Modal = ({modalService, modalClassName, walletService}: ModalProps) => {
  switch (modalService.modalState) {
    case 'topUpAccount':
      return (
        <ModalWrapper
          modalPosition="bottom"
          modalClassName={modalClassName}
          hideModal={modalService.hideModal}
        >
          <TopUp
            contractAddress={walletService.applicationWallet!.contractAddress}
            onRampConfig={{safello: {
              appId: '1234-5678',
              baseAddress: 'https://app.s4f3.io/sdk/quickbuy.html',
              addressHelper: true
            }}}
          />
        </ModalWrapper>
      );
    case 'waitingForDeploy':
      return (
        <WaitingFor />
      );
    default:
      return null;
  }
};

export default Modal;
