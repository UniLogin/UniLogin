import React from 'react';
import {useThemeClassFor, classForComponent} from '../utils/classFor';
import './../styles/base/notice.sass';
import './../styles/themes/Jarvis/noticeThemeJarvis.sass';
import './../styles/themes/UniLogin/noticeThemeUniLogin.sass';

export interface NoticeProps {
  message?: string;
}

export const Notice = ({message}: NoticeProps) => {
  const theme = useThemeClassFor();
  if (message) {
    return (
      <div className={`${theme} ${classForComponent('notice-wrapper')}`}>
        <div className={classForComponent('notice')}>
          <a
            className={classForComponent('notice-link')}
            rel='noopener noreferrer'
            target='_blank'
            href='https://medium.com/universal-ethereum/out-of-gas-were-shutting-down-unilogin-3b544838df1a'>
            UniLogin is closing.
          </a> Please make sure to withdraw all funds before 31 Dec 2020 ({message})
        </div>
      </div>
    );
  }
  return null;
};
