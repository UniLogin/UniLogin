import React from 'react';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/modalProgressBar.sass';
import '../styles/themes/UniLogin/modalProgressBarThemeUniLogin.sass';

interface ModalProgressBarProps {
  progress?: number;
  steps?: number;
}

export const ModalProgressBar = ({steps, progress}: ModalProgressBarProps) => {
  return (
    <div className={useClassFor('modal-progress-bar')}>
      <div className={classForComponent('modal-progress-bar-current')}></div>
    </div>
  )
}