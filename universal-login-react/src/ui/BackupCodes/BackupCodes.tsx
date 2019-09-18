import React, {useState} from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import BackupCodesLoader from './BackupCodesLoader';
import BackupCodesView from './BackupCodesView';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import './../styles/backup.sass';
import './../styles/backupDefault.sass';

export interface BackupProps {
  deployedWallet: DeployedWallet;
  className?: string;
}

type BackupState = 'Initial' | 'Loading' | 'Generated';

export const BackupCodes = ({deployedWallet, className}: BackupProps) => {
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [state, setState] = useState<BackupState>('Initial');

  const generateBackupCodes = async () => {
    setState('Loading');
    const codes = await deployedWallet.generateBackupCodes();
    setBackupCodes(codes.concat(backupCodes));
    setState('Generated');
  };

  function renderContent() {
    if (state === 'Loading') {
      return (
        <div className="backup-loader-wrapper">
          <BackupCodesLoader title="Generating backup codes, please wait" />
        </div>
      );
    } else if (backupCodes.length > 0) {
      return (
        <BackupCodesView
          codes={backupCodes}
          printCodes={window.print}
          walletContract={deployedWallet.name}
        />
      );
    }
    return (
      <button
        className="backup-btn backup-btn-primary generate-code-btn"
        onClick={generateBackupCodes}
      >
        Generate new code
      </button>
    );
  }

  return (
    <div className="universal-login-backup">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="backup">
          <h2 className="backup-title">Backup code</h2>
          <p className="backup-subtitle">
            If you lose all your devices you may not have other ways to recover your account.
            {state !== 'Initial'
              ? <strong> Keep your generate the recovery code safe.</strong>
              : ' Generate a recovery code and keep it safe'
            }
          </p>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default BackupCodes;
