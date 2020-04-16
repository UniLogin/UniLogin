import React from 'react';
import {BackupCodesWrapper} from './BackupCodesWrapper';

interface BackupCodesViewProps {
  codes: string[];
  walletContract: string;
  printCodes: () => void;
  className?: string;
}

export const BackupCodesView = ({codes, printCodes, walletContract, className}: BackupCodesViewProps) => {
  return (
    <BackupCodesWrapper className={className}>
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
    </BackupCodesWrapper>
  );
};

export default BackupCodesView;
