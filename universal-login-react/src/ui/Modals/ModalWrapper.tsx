import React, {ReactNode, useEffect} from 'react';
import {ModalPosition} from '../../core/models/ModalPosition';
import './../styles/modal.sass';
import './../styles/modalDefaults.sass';
import {escapePressed} from '@universal-login/commons';
import {Notice, NoticeProps} from '../commons/Notice';

interface ModalWrapperProps extends NoticeProps {
  children: ReactNode;
  modalPosition?: ModalPosition;
  modalClassName?: string;
  hideModal?: () => void;
}

export const ModalWrapper = ({modalPosition, children, modalClassName, hideModal, message}: ModalWrapperProps) => {
  const listenKeyboard = (event: KeyboardEvent) => {
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
    <div className={modalClassName ? `universal-login ${modalClassName}` : 'universal-login universal-login-default'}>
      <div className="modal-overlay" onClick={hideModal} />
      <div className={`modal-wrapper ${modalPosition || 'center'}`}>
        <div className="modal">
          {!!hideModal && <button onClick={hideModal} className="modal-close-btn" />}
          {children}
        </div>
        <Notice message={message} />
      </div>
    </div>
  );
};
