import React, {ReactNode, useEffect} from 'react';
import {escapePressed} from '@unilogin/commons';
import {Notice, NoticeProps} from '../commons/Notice';
import {classForComponent, useClassFor} from '../utils/classFor';
import './../styles/base/modal.sass';
import './../styles/themes/UniLogin/modalThemeUniLogin.sass';
import './../styles/themes/Legacy/modalThemeLegacy.sass';
import './../styles/themes/Jarvis/modalThemeJarvis.sass';

export interface ModalWrapperProps extends NoticeProps {
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
    <div className={useClassFor('modal-backdrop')}>
      <div className={modalClassName ? `universal-login ${modalClassName}` : 'universal-login'}>
        <div className={classForComponent('modal-overlay')} onClick={hideModal} />
        <div className={`${useClassFor('modal-wrapper')}`}>
          <div className={classForComponent('modal')}>
            {!!hideModal && <button onClick={hideModal} className={classForComponent('modal-close-btn')} />}
            {children}
          </div>
          <Notice message={message} />
        </div>
      </div>
    </div>
  );
};
