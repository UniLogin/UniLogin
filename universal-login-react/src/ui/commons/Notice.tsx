import React from 'react';
import './../styles/notice.sass';

export interface TestNetworkNoticeProps {
  message: string;
}

export const Notice = ({message}: TestNetworkNoticeProps) => {
  if (message) {
    return (
      <div className="notice-wrapper">
        <div className="notice">{message}</div>
      </div>
    );
  }
  return null;
};
