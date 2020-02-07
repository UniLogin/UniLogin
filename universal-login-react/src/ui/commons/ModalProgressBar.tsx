import React from 'react';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/modalProgressBar.sass'
import '../styles/themes/UniLogin/modalProgressBarThemeUniLogin.sass';

interface ModalProgressBarProps {
  steps?: number;
  progress?: number;
}

export const ModalProgressBar = ({steps = 5, progress = 1}: ModalProgressBarProps) => {
  return (
    <div className={useClassFor('modal-progress-bar')}>
      <div style={{width: `${progress / steps * 40}rem`}} className={classForComponent('modal-progress-bar-current')}></div>
    </div>
  );
};
