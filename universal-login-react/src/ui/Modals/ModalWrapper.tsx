import React, {ReactNode} from 'react';
import { ModalPosition } from '../../core/models/ModalPosition';
import './../styles/modal.css';
import './../styles/modalDefaults.css';

interface ModalWrapperProps {
  children: ReactNode;
  isVisible: boolean;
  modalPosition?: ModalPosition;
  className?: string;
}

export const ModalWrapper = ({ modalPosition, children, isVisible, className}: ModalWrapperProps) => (
  <>
    {isVisible &&
      <div className={className ? `universal-login ${className}` : 'universal-login-defaults'}>
        <div className="modal-overlay" />
        <div className={`modal-wrapper ${modalPosition ? modalPosition : 'center'}`}>
          {children}
        </div>
      </div>
    }
  </>
);
