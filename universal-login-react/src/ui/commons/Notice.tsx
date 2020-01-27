import React from 'react';
import './../styles/notice.sass';

export interface NoticeProps {
  message: string;
}

export const Notice = ({message}: NoticeProps) => {
  if (message) {
    return (
      <div className={'notice-wrapper'}>
        <div className="notice">{message}</div>
      </div>
    );
  }
  return null;
};
