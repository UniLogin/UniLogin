import React from 'react';
import {useClassFor, classForComponent} from '../utils/classFor';
import {getModalProgressWidth} from '../../core/utils/getModalProgressWidth';
import {MAX_PROGRESS_BAR_WIDTH} from '../../core/constants/maxProgressBarWidth';
import '../styles/base/modalProgressBar.sass';
import '../styles/themes/UniLogin/components/modal/modalProgressBarThemeUniLogin.sass';
import '../styles/themes/Legacy/components/modal/modalProgressBarThemeLegacy.sass';
import '../styles/themes/Jarvis/components/modal/modalProgressBarThemeJarvis.sass';

interface ModalProgressBarProps {
  steps?: number;
  progress?: number;
}

export const ModalProgressBar = ({steps = 0, progress = 0}: ModalProgressBarProps) => {
  const barWidth = getModalProgressWidth(progress, steps) / MAX_PROGRESS_BAR_WIDTH * 100;
  return (
    <div className={useClassFor('modal-progress-bar')}>
      <div style={{width: `${barWidth}%`}} className={classForComponent('modal-progress-bar-current')}></div>
    </div>
  );
};
