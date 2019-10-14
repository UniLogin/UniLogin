import React, {ReactNode} from 'react';
import {USubHeaderProps, USubHeader} from '../USubHeader';
import {NoticeProps, Notice} from '../../commons/Notice';

export interface USubScreenWrapperProps extends USubHeaderProps, NoticeProps {
  children: ReactNode;
}

export const USubScreenWrapper = ({children, ensName, message, onBackButtonClick}: USubScreenWrapperProps) => (
  <>
    <USubHeader onBackButtonClick={onBackButtonClick} ensName={ensName} />
    <Notice message={message} />
    <div className="udashboard-content">
      {children}
    </div>
  </>
);
