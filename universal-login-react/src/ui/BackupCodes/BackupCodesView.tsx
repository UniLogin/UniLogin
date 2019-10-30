import React from 'react';

interface BackupCodesViewProps {
  codes: string[];
  walletContract: string;
  printCodes: () => void;
}

export const BackupCodesView = ({codes, printCodes, walletContract}: BackupCodesViewProps) => {
  return (
    <div>
      <div className="backup-codes-list">
        {codes.map((code: string) =>
          <div className="backup-codes-item" key={code}>
            <div>
              <p className="backup-code-contract">{walletContract}</p>
              <p className="backup-code">{code}</p>
            </div>
          </div>,
        )}
        <div className="backup-codes-buttons">
          <button onClick={printCodes} className="backup-print-btn">Print codes</button>
        </div>
      </div>
      <p className="backup-subtitle">
        <strong>
          Keep your generated recovery code safe.
        </strong>
      </p>
    </div>
  );
};

export default BackupCodesView;
