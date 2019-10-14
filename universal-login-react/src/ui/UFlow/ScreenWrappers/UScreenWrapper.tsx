import React, {ReactNode} from 'react';
import {UHeaderProps, UHeader} from '../UHeader';
import {NoticeProps, Notice} from '../../commons/Notice';
import {UNavBarMobile} from '../UNavBarMobile';

export interface UScreenWrapperProps extends UHeaderProps, NoticeProps {
  children: ReactNode;
}

export const UScreenWrapper = ({message, ensName, activeTab, setActiveTab, children}: UScreenWrapperProps) => (
  <>
    <UHeader ensName={ensName} activeTab={activeTab} setActiveTab={setActiveTab} />
    <Notice message={message}/>
    <div className="udashboard-content">
      {children}
    </div>
    <UNavBarMobile activeTab={activeTab} setActiveTab={setActiveTab}/>
  </>
);
