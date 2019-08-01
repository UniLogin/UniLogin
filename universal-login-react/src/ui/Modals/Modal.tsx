import React from 'react';
import {TopUp} from '../TopUp/TopUp';
import {ModalWrapper} from './ModalWrapper';
import ModalService from '../../core/services/ModalService';
import WaitingFor from '../commons/WaitingFor';

export interface ModalProps {
  modalService: ModalService;
  modalClassName?: string;
  contractAddress?: string;
}

const Modal = ({modalService, modalClassName, contractAddress}: ModalProps) => {
  switch (modalService.modalState) {
    case 'topUpAccount':
      return (
        <ModalWrapper
          modalPosition="bottom"
          modalClassName={modalClassName}
          hideModal={modalService.hideModal}
        >
          <TopUp
            contractAddress={contractAddress as string}
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
        <ModalWrapper modalPosition="bottom">
          <WaitingFor />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

export default Modal;
