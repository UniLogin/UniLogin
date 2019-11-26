import React, {useContext} from 'react';
import ModalWrapperWithoutClose from './ModalWrapper';
import {useServices} from '../../hooks';
import ModalWrapperClosable from './ModalWrapperClosable';
import {TopUp, WaitingForTransaction} from '@universal-login/react';
import {TopUpModalProps, WalletModalContext} from '../../../core/entities/WalletModalContext';
import ModalTransfer from './Transfer/ModalTransfer';

const Modal = () => {
  const modalService = useContext(WalletModalContext);
  const {sdk} = useServices();
  const relayerConfig = sdk.getRelayerConfig();

  switch (modalService.modalName) {
    case 'transfer':
      return (
        <ModalWrapperClosable hideModal={modalService.hideModal}>
          <ModalTransfer />
        </ModalWrapperClosable>
      );
    case 'waitingForTransfer':
      return (
        <ModalWrapperWithoutClose>
          <WaitingForTransaction
            {...modalService.modalProps}
            action={'Transferring funds'}
            relayerConfig={relayerConfig!}
            className="jarvis-styles"
          />
        </ModalWrapperWithoutClose>
      );
    case 'error':
      return (
        <ModalWrapperClosable hideModal={modalService.hideModal}>
          <div className="jarvis-modal">
            <div className="box-header">
              <h2 className="box-title">Error</h2>
            </div>
            <div className="modal-content">
              <div className="modal">
                <div className="error-message">
                  <div>Something went wrong.. Try again.</div>
                  <div>{modalService.modalProps}</div>
                </div>
              </div>
            </div>
          </div>
        </ModalWrapperClosable>
      );
    default:
      return null;
  }
};

export default Modal;
