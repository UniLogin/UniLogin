import React from 'react';

interface EmptyBackupCodesViewProps {
  generateBackupCodes: () => void;
}

export const EmptyBackupCodesView = ({generateBackupCodes}: EmptyBackupCodesViewProps) => (
  <>
    <p className="backup-text">If you lose all your devices you may not have other ways to recover your account. Generate a recovery code and keep it safe</p>
    <button onClick={generateBackupCodes} className="settings-btn">Generate new codes</button>
  </>
);

export default EmptyBackupCodesView;
