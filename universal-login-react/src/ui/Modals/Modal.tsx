import React, {useContext} from 'react';
import {TopUp} from '../TopUp/TopUp';
import {ModalWrapper} from './ModalWrapper';
import WaitingFor from '../commons/WaitingFor';
import {ReactModalContext, TopUpProps} from '../../core/models/ReactModalContext';

export interface ModalProps {
  modalClassName?: string;
}

const Modal = ({modalClassName}: ModalProps) => {
  const modalService = useContext(ReactModalContext);
  switch (modalService.modalState) {
    case 'topUpAccount':
      return (
        <ModalWrapper
          modalPosition="bottom"
          modalClassName={modalClassName}
          hideModal={modalService.hideModal}
        >
          <TopUp
            {...modalService.modalProps as TopUpProps}
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
