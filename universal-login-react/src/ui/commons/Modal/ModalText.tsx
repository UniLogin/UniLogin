import React from 'react';
import '../../styles/base/components/modal/modalText.sass';
import {useClassFor} from '../../utils/classFor';

interface ModalTextProps {
  children: string;
}

export const ModalText = ({children}: ModalTextProps) => (
  <p className={useClassFor('modal-text')}>{children}</p>
);
