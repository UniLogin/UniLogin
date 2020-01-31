import React, {ReactNode, useEffect} from 'react';
import {escapePressed} from '@universal-login/commons';
import {Notice, NoticeProps} from '../commons/Notice';
import {useThemeClassFor} from '../utils/classFor';
import './../styles/modal.sass';
import './../styles/modalDefaults.sass';
import './../styles/themes/UniLogin/modalThemeUniLogin.sass';
import './../styles/themes/Legacy/modalThemeLegacy.sass';
import './../styles/themes/Jarvis/modalThemeJarvis.sass';

interface ModalWrapperProps extends NoticeProps {
  children: ReactNode;
  modalClassName?: string;
  hideModal?: () => void;
}

export const ModalWrapper = ({children, modalClassName, hideModal, message}: ModalWrapperProps) => {
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
      <div className={`${useThemeClassFor()} modal-wrapper`}>
        <div className="modal">
          {!!hideModal && <button onClick={hideModal} className="modal-close-btn" />}
          {children}
        </div>
        <Notice message={message} />
      </div>
    </div>
  );
};
