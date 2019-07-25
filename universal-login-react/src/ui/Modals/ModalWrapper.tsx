import React, {ReactNode} from 'react';
import { ModalPosition } from '../../core/models/ModalPosition';
import './../styles/modal.css';

interface ModalWrapperProps {
  children: ReactNode;
  isVisible: boolean;
  modalPosition?: ModalPosition;
}

export const ModalWrapper = ({ modalPosition, children, isVisible}: ModalWrapperProps) => (
  <>
    {isVisible &&
      <>
        <div className="modal-overlay" />
        <div className={`modal-wrapper ${modalPosition ? modalPosition : 'center'}`}>
          {children}
        </div>
      </>
    }
  </>
);
