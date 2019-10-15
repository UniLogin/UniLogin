import React, {ReactNode} from 'react';
import {SubDialogHeaderProps, SubDialogHeader} from '../Headers/SubDialogHeader';
import {NoticeProps, Notice} from '../../commons/Notice';

export interface SubDialogWrapperProps extends SubDialogHeaderProps, NoticeProps {
  children: ReactNode;
}

export const SubDialogWrapper = ({children, ensName, message, onBackButtonClick}: SubDialogWrapperProps) => (
  <>
    <SubDialogHeader onBackButtonClick={onBackButtonClick} ensName={ensName} />
    <Notice message={message} />
    <div className="udashboard-content">
      {children}
    </div>
  </>
);
