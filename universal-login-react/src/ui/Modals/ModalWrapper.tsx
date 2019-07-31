import React, {ReactNode, useEffect} from 'react';
import { ModalPosition } from '../../core/models/ModalPosition';
import './../styles/modal.css';
import './../styles/modalDefaults.css';
import {escapePressed} from '@universal-login/commons';
import closeIcon from './../assets/icons/close.svg';

interface ModalWrapperProps {
  children: ReactNode;
  modalPosition?: ModalPosition;
  modalClassName?: string;
  hideModal?: () => void;
}

export const ModalWrapper = ({ modalPosition, children, modalClassName, hideModal}: ModalWrapperProps) => {

  const listenKeyboard = (event : KeyboardEvent) => {
    if (escapePressed(event) && hideModal) {
      hideModal();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', listenKeyboard, true);
    return () => {
      window.removeEventListener('keydown', listenKeyboard, true);
    };
  });


  return (
    <>
      <div className={modalClassName ? `universal-login ${modalClassName}` : 'universal-login-defaults'}>
        <div className="modal-overlay" onClick={hideModal} />
        <div className={`modal-wrapper ${modalPosition ? modalPosition : 'center'}`}>
          {!!hideModal &&
            <button onClick={hideModal} className="modal-close-btn">
              <img src={closeIcon} alt="close"/>
            </button>
          }
          {children}
        </div>
      </div>
    </>
  );
};
