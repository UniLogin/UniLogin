import React, {useContext} from 'react';
import {ModalWrapper} from './ModalWrapper';
import WaitingFor from '../commons/WaitingFor';
import {ReactModalContext, TopUpProps} from '../../core/models/ReactModalContext';
import {TopUp} from '../TopUp/TopUp';

export interface ModalsProps {
  modalClassName?: string;
}

const Modals = ({modalClassName}: ModalsProps) => {
  const modalService = useContext(ReactModalContext);
  switch (modalService.modalState) {
    case 'topUpAccount':
      return (
        <ModalWrapper
          modalClassName={modalClassName}
          hideModal={modalService.hideModal}
        >
          <TopUp
            hideModal={modalService.hideModal}
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
    case 'topUp':
      return (
        <ModalWrapper modalPosition="bottom">
          <WaitingFor />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

export default Modals;
