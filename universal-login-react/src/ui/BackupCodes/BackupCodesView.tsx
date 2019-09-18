import React from 'react';
import Avatar from '../assets/avatar.svg';

interface BackupCodesViewProps {
  codes: string[];
  walletContract: string;
  printCodes: () => void;
}

export const BackupCodesView = ({codes, printCodes, walletContract}: BackupCodesViewProps) => {
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
        <button onClick={printCodes} className="backup-print-btn">Print codes</button>
      </div>
    </>
  );
};

export default BackupCodesView;
