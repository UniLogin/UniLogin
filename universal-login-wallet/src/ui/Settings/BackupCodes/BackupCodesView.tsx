import React from 'react';
import Avatar from '../../../assets/avatar.svg';
import BackupCodesLoader from './BackupCodesLoader';

interface BackupCodesViewProps {
  codes: string[];
  walletContract: string;
  printCodes: () => void;
  removeBackupCodes: () => void;
  loading: boolean;
}

const BackupCodesView = ({codes, printCodes, walletContract, removeBackupCodes, loading}: BackupCodesViewProps) => {
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
      {loading && <BackupCodesLoader title="Creating more codes"/>}
      <div className="backup-codes-buttons">
        <button className="backup-btn backup-create-btn" disabled={loading}>Create more codes</button>
        <button onClick={printCodes} className="backup-btn backup-print-btn">Print codes</button>
      </div>
      <div className="backup-buttons-row">
        <button onClick={removeBackupCodes} className="btn btn-secondary">Cancel backup code</button>
        <button className="btn btn-primary">Set as backup codes</button>
      </div>
    </>
  );
};

export default BackupCodesView;
