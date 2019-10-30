import React from 'react';
import {BackupCodesWrapper} from './BackupCodesWrapper';

interface BackupCodesInitialProps {
  generateBackupCodes: () => void;
  className?: string;
}

export const BackupCodesInitial = ({generateBackupCodes, className}: BackupCodesInitialProps) => (
  <BackupCodesWrapper className={className}>
    <p className="backup-subtitle">Generate a recovery code and keep it safe</p>
    <button
      className="backup-btn backup-btn-primary generate-code-btn"
      onClick={generateBackupCodes}
    >
        Generate new code
    </button>
  </BackupCodesWrapper>
);
