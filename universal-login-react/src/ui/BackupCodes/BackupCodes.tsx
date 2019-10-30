import React, {useState, ReactNode} from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import BackupCodesLoader from './BackupCodesLoader';
import BackupCodesView from './BackupCodesView';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import './../styles/backup.sass';
import './../styles/backupDefault.sass';
import BackupCodesFailure from './BackupCodesFailure';

export interface BackupProps {
  deployedWallet: DeployedWallet;
  className?: string;
}

type BackupState = 'Initial' | 'Loading' | 'Generated' | 'Failure';

export const BackupCodes = ({deployedWallet, className}: BackupProps) => {
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [state, setState] = useState<BackupState>('Initial');

  const generateBackupCodes = async () => {
    setState('Loading');
    try {
      const {waitToBeSuccess} = await deployedWallet.generateBackupCodes();
      const codes = await waitToBeSuccess();
      setBackupCodes(codes.concat(backupCodes));
      setState('Generated');
    } catch (e) {
      console.error(e);
      setState('Failure');
    }
  };

  const BackupCodesInitial = () => (
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

  const BackupCodesWrapper = ({children}: {children: ReactNode}) => (
    <div className="universal-login-backup">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="backup">
          <h2 className="backup-title">Backup code</h2>
          <p className="backup-subtitle">
            If you lose all your devices you may not have other ways to recover your account.
          </p>
          {children}
        </div>
      </div>
    </div>)

  function renderContent() {
    if (state === 'Loading') {
      return <BackupCodesLoader title="Generating backup codes, please wait" />;
    } else if (state === 'Failure') {
      return <BackupCodesFailure/>;
    } else if (backupCodes.length > 0) {
      return (
        <BackupCodesView
          codes={backupCodes}
          printCodes={window.print}
          walletContract={deployedWallet.name}
        />
      );
    }
    return <BackupCodesInitial/>;
  }

  return (
    <BackupCodesWrapper>
      {renderContent()}
    </BackupCodesWrapper>
  );
};

export default BackupCodes;
