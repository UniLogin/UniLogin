import React from 'react';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/progress-bar.css';
import '../styles/themes/Jarvis/components/progressBarThemeJarvis.sass';

interface ProgressBarProps {
  dual?: boolean;
}

export const ProgressBar = ({dual}: ProgressBarProps) => (
  <div className={`${useClassFor('progress-bar')}`}>
    <div className={`${classForComponent('progress-bar-line')} ${dual ? 'dual' : ''}`} />
  </div>
);

export default ProgressBar;
