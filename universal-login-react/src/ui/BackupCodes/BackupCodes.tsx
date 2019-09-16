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
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateBackupCodes = () => {
    const backupCodes = ['wokzai-tarwib-lezvie-lawgod', 'kenmil-syonuh-jujaro-zansar'];
    setLoading(true);

    setTimeout(() => {
      setCodes(backupCodes);
      setLoading(false);
    }, 2000);
  };

  const removeBackupCodes = () => {
    const message = 'You have NOT saved your backup keys! Proceeding will cancel and render these codes useless';
    if (confirm(message)) {
      setCodes([]);
    }
  };

  function renderContent() {
    if (loading && !codes.length) {
      return (
        <div className="backup-loader-wrapper">
          <BackupCodesLoader title="Generating backup codes, please wait" />
          <button className="backup-btn backup-btn-secondary cancel-backup-btn">Cancel backup code</button>
        </div>
      );
    } else if (codes.length) {
      return (
        <BackupCodesView
          codes={codes}
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
            {codes.length > 0
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
