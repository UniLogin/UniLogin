import React, {ReactNode} from 'react';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

interface BackupCodesWrapperProps {
  children: ReactNode;
  className?: string;
}

export const BackupCodesWrapper = ({children, className}: BackupCodesWrapperProps) => (
  <div className="universal-login-backup">
    <div className={getStyleForTopLevelComponent(className)}>
      <div className="backup">
        <h2 className="backup-title">Backup code</h2>
        <p className="backup-subtitle">
          If you lose all your devices you may not have other ways to recover your account.
        </p>
        {children}
      </div>
    </div>
  </div>
);
