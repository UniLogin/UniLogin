import React from 'react';
import {useClassFor, classForComponent} from '../utils/classFor';
import {getModalProgressWidth} from '../../core/utils/getModalProgressWidth';
import '../styles/base/modalProgressBar.sass';
import '../styles/themes/UniLogin/modalProgressBarThemeUniLogin.sass';

interface ModalProgressBarProps {
  steps?: number;
  progress?: number;
}

export const ModalProgressBar = ({steps = 0, progress = 0}: ModalProgressBarProps) => {
  return (
    <div className={useClassFor('modal-progress-bar')}>
      <div style={{width: `${getModalProgressWidth(progress, steps)}rem`}} className={classForComponent('modal-progress-bar-current')}></div>
    </div>
  );
};
