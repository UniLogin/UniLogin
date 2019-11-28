import React, {useContext} from 'react';
import ModalWrapperClosable from './ModalWrapperClosable';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';

const Modal = () => {
  const modalService = useContext(WalletModalContext);

  switch (modalService.modalName) {
    case 'transfer':
      throw Error('Invalid ModalName');
    case 'waitingForTransfer':
      throw Error('Invalid ModalName (waitingForTransfer)');
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
