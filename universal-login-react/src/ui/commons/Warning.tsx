import React from 'react';
import {useThemeClassFor, classForComponent} from '../utils/classFor';
import './../styles/base/warning.sass';
import './../styles/themes/Jarvis/warningThemeJarvis.sass';
import warnIcon from './../assets/icons/warn.svg';

export interface WarningProps {
  message: string;
}

export const Warning = ({message}: WarningProps) => {
  const theme = useThemeClassFor();
  return (
    <div className={`${theme} ${classForComponent('warning-wrapper')}`}>
      <img className={classForComponent('warning-icon')} src={warnIcon} />
      <div className={classForComponent('warning')}>{message}</div>
    </div>
  );
};
