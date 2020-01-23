import React from 'react';
import '../../styles/components/modal/modalTitle.sass'

interface ModalTitleProps {
  children: string;
}

export const ModalTitle = ({children}: ModalTitleProps) => <p className="modal-title">{children}</p>
