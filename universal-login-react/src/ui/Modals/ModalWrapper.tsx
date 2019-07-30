import React, {ReactNode} from 'react';
import { ModalPosition } from '../../core/models/ModalPosition';
import './../styles/modal.css';
import './../styles/modalDefaults.css';

interface ModalWrapperProps {
  children: ReactNode;
  isVisible: boolean;
  modalPosition?: ModalPosition;
  modalClassName?: string;
}

export const ModalWrapper = ({ modalPosition, children, isVisible, modalClassName}: ModalWrapperProps) => (
  <>
    {isVisible &&
      <div className={modalClassName ? `universal-login ${modalClassName}` : 'universal-login-defaults'}>
        <div className="modal-overlay" />
        <div className={`modal-wrapper ${modalPosition ? modalPosition : 'center'}`}>
          {children}
        </div>
      </div>
    }
  </>
);
