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

export const BackupCodes = ({deployedWallet, className}: BackupProps) => {
  const [loading, setLoading] = useState(false);
  const [backupCode, setBackupCode] = useState<string | undefined>(undefined);

  const generateBackupCodes = async () => {
    setLoading(true);
    const backupCode = await deployedWallet.generateBackupCode();
    setBackupCode(backupCode);
    setLoading(false);
  };

  const removeBackupCodes = () => {
    const message = 'You have NOT saved your backup keys! Proceeding will cancel and render these codes useless';
    if (confirm(message)) {
      setBackupCode(undefined);
    }
  };

  function renderContent() {
    if (loading && !backupCode) {
      return (
        <div className="backup-loader-wrapper">
          <BackupCodesLoader title="Generating backup codes, please wait" />
          <button className="backup-btn backup-btn-secondary cancel-backup-btn">Cancel backup code</button>
        </div>
      );
    } else if (!!backupCode) {
      return (
        <BackupCodesView
          code={backupCode}
          printCodes={window.print}
          walletContract={deployedWallet.name}
          removeBackupCodes={removeBackupCodes}
          generateBackupCodes={generateBackupCodes}
          loading={loading}
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
            {!!backupCode
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
