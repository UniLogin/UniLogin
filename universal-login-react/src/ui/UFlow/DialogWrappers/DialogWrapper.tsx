import React, {ReactNode} from 'react';
import {DialogHeaderProps, DialogHeader} from '../Headers/DialogHeader';
import {NoticeProps, Notice} from '../../commons/Notice';
import {UNavBarMobile} from '../UNavBarMobile';
import {useThemeName} from '../../utils/classFor';

export interface DialogWrapperProps extends DialogHeaderProps, NoticeProps {
  children: ReactNode;
}

export const DialogWrapper = ({message, deployedWallet, children}: DialogWrapperProps) => {
  const theme = useThemeName();
  return (
    <>
      <DialogHeader deployedWallet={deployedWallet} />
      {theme !== 'unilogin' && <Notice message={message}/>}
      <div className="udashboard-content">
        {children}
      </div>
      {theme === 'unilogin' && <Notice message={message}/>}
      <UNavBarMobile deployedWallet={deployedWallet} />
    </>
  );
};
