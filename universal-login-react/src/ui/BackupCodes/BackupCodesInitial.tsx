import React from 'react';

export const BackupCodesInitial = ({generateBackupCodes}: {generateBackupCodes: () => void}) => (
  <div>
    <p className="backup-subtitle">Generate a recovery code and keep it safe</p>
    <button
      className="backup-btn backup-btn-primary generate-code-btn"
      onClick={generateBackupCodes}
    >
      Generate new code
    </button>
  </div>
);
