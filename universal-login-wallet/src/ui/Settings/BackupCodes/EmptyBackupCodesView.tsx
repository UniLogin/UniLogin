import React from 'react';

interface EmptyBackupCodesViewProps {
  generateBackupCodes: () => void;
}

const EmptyBackupCodesView = ({generateBackupCodes}: EmptyBackupCodesViewProps) => (
  <>
    <p className="backup-text">If you lose all your devices you may not have other ways to recover your account. Generate a recovery code and keep it safe</p>
    <div className="backup-codes-buttons">
      <button onClick={generateBackupCodes} className="backup-btn backup-generate-btn">Generate new codes</button>
    </div>
  </>
);

export default EmptyBackupCodesView;
