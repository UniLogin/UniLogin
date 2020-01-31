import React from 'react';
import {useClassFor} from '../../utils/classFor';
import '../../styles/base/buttonClose.sass';

interface ButtonCloseProps {
  onClick: Function;
};

export const ButtonClose = ({onClick}: ButtonCloseProps) => {
  return (
    <button onClick={() => onClick()} className={useClassFor('button-close')}></button>
  )
}