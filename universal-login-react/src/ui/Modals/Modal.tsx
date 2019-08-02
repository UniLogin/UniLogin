import React, {useContext} from 'react';
import {TopUp} from '../TopUp/TopUp';
import {ModalWrapper} from './ModalWrapper';
import WaitingFor from '../commons/WaitingFor';
import {ReactModalContext} from '../../core/models/ReactModalContext';

export interface ModalProps {
  modalClassName?: string;
  contractAddress?: string;
}

const Modal = ({modalClassName, contractAddress}: ModalProps) => {
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
