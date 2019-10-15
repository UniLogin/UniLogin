import React, {ReactNode} from 'react';
import {DialogHeaderProps, DialogHeader} from '../Headers/DialogHeader';
import {NoticeProps, Notice} from '../../commons/Notice';
import {UNavBarMobile} from '../UNavBarMobile';

export interface DialogWrapperProps extends DialogHeaderProps, NoticeProps {
  children: ReactNode;
}

export const DialogWrapper = ({message, ensName, activeTab, setActiveTab, children}: DialogWrapperProps) => (
  <>
    <DialogHeader ensName={ensName} activeTab={activeTab} setActiveTab={setActiveTab} />
    <Notice message={message}/>
    <div className="udashboard-content">
      {children}
    </div>
    <UNavBarMobile activeTab={activeTab} setActiveTab={setActiveTab}/>
  </>
);
