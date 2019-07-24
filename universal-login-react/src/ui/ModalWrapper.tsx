import React, {ReactNode} from 'react';
import {TopUpClassName} from '../core/models/TopUpClassName';

interface ModalWrapperProps {
  topUpClassName: TopUpClassName;
  children: ReactNode;
}

export const ModalWrapper = ({topUpClassName, children}: ModalWrapperProps) => (
  <div className={`modal-wrapper ${topUpClassName}`}>
    {children}
  </div>
);
