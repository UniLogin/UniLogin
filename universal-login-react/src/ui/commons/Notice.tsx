import React from 'react';
import './../styles/test-network-notice.sass';

export interface TestNetworkNoticeProps {
  message: string;
}

export const Notice = ({message}: TestNetworkNoticeProps) => {
  if (message) {
    return <div className="notice">{message}</div>;
  }
  return null;
};
