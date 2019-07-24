import React, {ReactNode} from 'react';
import {ModalName} from '../core/models/ModalName';

interface ModalWrapperProps {
  modalName: ModalName;
  children: ReactNode;
}

export const ModalWrapper = ({modalName, children}: ModalWrapperProps) => (
  <div className={`modal-wrapper ${modalName}`}>
    {children}
  </div>
);
