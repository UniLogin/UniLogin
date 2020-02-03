import React from 'react';
import {useThemeClassFor, classForComponent} from '../utils/classFor';
import './../styles/notice.sass';
import './../styles/themes/Legacy/noticeThemeLegacy.sass';
import './../styles/themes/Jarvis/noticeThemeJarvis.sass';
export interface NoticeProps {
  message?: string;
}

export const Notice = ({message}: NoticeProps) => {
  const theme = useThemeClassFor();
  if (message) {
    return (
      <div className={`${theme} ${classForComponent('notice-wrapper')}`}>
        <div className={classForComponent('notice')}>{message}</div>
      </div>
    );
  }
  return null;
};
