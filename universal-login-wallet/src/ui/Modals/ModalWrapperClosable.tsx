import React, {useEffect} from 'react';
import {KEY_CODE_ESCAPE} from '@universal-login/commons';

interface ModalWrapperProps {
  hideModal: (...args: any[]) => void;
  children: any;
}

const ModalWrapperClosable = ({children, hideModal} : ModalWrapperProps) => {
  const listenKeyboard = (event : any) => {
    if (event.key === 'Escape' || event.keyCode === KEY_CODE_ESCAPE) {
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
      <div className="modal-overlay" onClick={hideModal} />
      <div className="modal-wrapper">
        <div className="modal">
          <button className="modal-close-btn" onClick={hideModal} />
          {children}
        </div>
      </div>
    </>
  );
};

export default ModalWrapperClosable;
