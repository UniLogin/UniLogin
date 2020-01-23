import React from 'react';
import '../../styles/base/components/modal/modalTitle.sass';
import {useClassFor} from '../../utils/classFor';

interface ModalTitleProps {
  children: string;
}

export const ModalTitle = ({children}: ModalTitleProps) => (
  <p className={useClassFor('modal-title')}>{children}</p>
);
