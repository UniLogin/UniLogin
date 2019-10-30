import React, {useState} from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import BackupCodesLoader from './BackupCodesLoader';
import BackupCodesView from './BackupCodesView';
import './../styles/backup.sass';
import './../styles/backupDefault.sass';
import BackupCodesFailure from './BackupCodesFailure';
import {BackupCodesInitial} from './BackupCodesInitial';
import {BackupCodesWrapper} from './BackupCodesWrapper';

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
    return <BackupCodesInitial generateBackupCodes={generateBackupCodes} />;
  }

  return (
    <BackupCodesWrapper className={className}>
      {renderContent()}
    </BackupCodesWrapper>
  );
};

export default BackupCodes;
