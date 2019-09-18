import React from 'react';
import Avatar from '../assets/avatar.svg';
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
      {codes.map((code: string) =>
        <ul key={code} className="backup-codes-list">
          <div className="backup-codes-item" key={code}>
            <img src={Avatar} alt="avatar" className="backup-codes-img" />
            <div>
              <p className="backup-code-contract">{walletContract}</p>
              <p className="backup-code">{code}</p>
            </div>
          </div>
        </ul>
      )}
      <div className="backup-codes-buttons">
        <button onClick={generateBackupCodes} className="backup-create-btn" disabled={loading}>Create more codes</button>
        <button onClick={printCodes} className="backup-print-btn">Print codes</button>
      </div>
      {loading && <BackupCodesLoader title="Setting backup codes, please wait" />}
      <div className="backup-buttons-row">
        <button onClick={removeBackupCodes} className="backup-btn backup-btn-secondary backup-cancel-btn">Cancel backup code</button>
        <button className="backup-btn backup-btn-primary" disabled={loading}>Set as backup codes</button>
      </div>
    </>
  );
};

export default BackupCodesView;
