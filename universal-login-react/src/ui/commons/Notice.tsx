import React from 'react';
import './../styles/notice.sass';
import './../styles/themes/Legacy/noticeThemeLegacy.sass';
import './../styles/themes/Jarvis/noticeThemeJarvis.sass';
import {useThemeClassFor} from '../utils/classFor';
export interface NoticeProps {
  message?: string;
}

export const Notice = ({message}: NoticeProps) => {
  const theme = useThemeClassFor();
  if (message) {
    return (
      <div className={`${theme} notice-wrapper`}>
        <div className="notice">{message}</div>
      </div>
    );
  }
  return null;
};
