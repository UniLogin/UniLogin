import React from 'react';
import Avatar from '../../assets/avatar.svg';
import BackupCodesLoader from './BackupCodesLoader';

interface BackupCodesViewProps {
  codes: string[];
  walletContract: string;
  printCodes: () => void;
  removeBackupCodes: () => void;
  generateBackupCodes: () => void;
  loading: boolean;
}

export const BackupCodesView = ({codes, printCodes, walletContract, removeBackupCodes, loading, generateBackupCodes}: BackupCodesViewProps) => {
  return (
    <>
      <p className="backup-text">Print these, cut them apart and keep them safe locations apart from each other. Keep them away from computers until you want to use them.</p>
      <div className="codes-row">
        {codes.map(code => (
          <div className="code-block" key={code}>
            <img src={Avatar} alt="avatar" className="code-block-img" />
            <div>
              <p className="code-block-id">{walletContract}</p>
              <p className="code">{code}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="backup-codes-buttons">
        <button onClick={generateBackupCodes} className="backup-btn backup-create-btn" disabled={loading}>Create more codes</button>
        <button onClick={printCodes} className="backup-btn backup-print-btn">Print codes</button>
      </div>
      {loading && <BackupCodesLoader title="Setting backup codes, please wait"/>}
      <div className="backup-buttons-row">
        <button onClick={removeBackupCodes} className="btn btn-secondary">Cancel backup code</button>
        <button className="btn btn-primary" disabled={loading}>Set as backup codes</button>
      </div>
    </>
  );
};

export default BackupCodesView;
