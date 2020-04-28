import React, {ReactNode} from 'react';
import {SubDialogHeaderProps, SubDialogHeader} from '../Headers/SubDialogHeader';
import {NoticeProps, Notice} from '../../commons/Notice';
import {useThemeName} from '../../utils/classFor';

export interface SubDialogWrapperProps extends SubDialogHeaderProps, NoticeProps {
  children: ReactNode;
}

export const SubDialogWrapper = ({children, ensName, message}: SubDialogWrapperProps) => {
  const theme = useThemeName();
  return (
    <>
      <SubDialogHeader ensName={ensName} />
      {theme !== 'unilogin' && <Notice message={message}/>}
      <div className="udashboard-content">
        {children}
      </div>
      {theme === 'unilogin' && <Notice message={message}/>}
    </>
  );
};
