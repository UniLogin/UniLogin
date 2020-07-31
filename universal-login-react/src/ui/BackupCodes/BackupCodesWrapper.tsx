import React, {ReactNode} from 'react';
import {ThemedComponent} from '../commons/ThemedComponent';

interface BackupCodesWrapperProps {
  children: ReactNode;
  className?: string;
}

export const BackupCodesWrapper = ({children, className}: BackupCodesWrapperProps) => (
  <ThemedComponent className={className} name="backup">
    <div className='backup-content'>
      <h2 className="backup-title">Generate backup code</h2>
      <p className="backup-subtitle">
        If you lose all your devices you may not have other ways to recover your account.
        <strong>Remember to keep your generated recovery code safe.</strong>
      </p>
    </div>
    {children}
  </ThemedComponent>
);
