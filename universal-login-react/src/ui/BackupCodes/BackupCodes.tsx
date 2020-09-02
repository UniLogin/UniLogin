import React, {useState} from 'react';
import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import BackupCodesView from './BackupCodesView';
import {Prompt} from 'react-router-dom';
import './../styles/base/backup.sass';
import './../styles/themes/Legacy/backupThemeLegacy.sass';
import './../styles/themes/UniLogin/backupThemeUniLogin.sass';
import './../styles/themes/Jarvis/backupThemeJarvis.sass';
import {BackupCodesInitial} from './BackupCodesInitial';
import {ErrorMessage} from '../commons/ErrorMessage';
import {WaitingForTransaction} from '../commons/WaitingForTransaction';
import {GasParameters} from '@unilogin/commons';
import {BackupCodesService} from '../../core/services/BackupCodesService';
import {useProperty} from '../hooks/useProperty';

export interface BackupProps {
  deployedWallet: DeployedWithoutEmailWallet;
  className?: string;
}

export const BackupCodes = ({deployedWallet, className}: BackupProps) => {
  const [gasParameters, setGasParameters] = useState<GasParameters | undefined>(undefined);

  const relayerConfig = deployedWallet.sdk.getRelayerConfig();

  const [backupCodesService] = useState(() => new BackupCodesService(deployedWallet));

  const generateBackupCodes = async () => backupCodesService.generate(gasParameters);

  const state = useProperty(backupCodesService.state);

  switch (state.kind) {
    case 'Initial':
      return (
        <BackupCodesInitial
          generateBackupCodes={generateBackupCodes}
          isButtonDisabled={!gasParameters}
          deployedWallet={deployedWallet}
          setGasParameters={setGasParameters}
          className={className}
        />
      );
    case 'InProgress':
      return (<>
        <Prompt message="Are you sure you want to leave? The backup code is being generated." />
        <WaitingForTransaction
          action='Generating backup code'
          relayerConfig={relayerConfig}
          transactionHash={state.transactionHash}
        />
      </>);
    case 'Generated':
      return (
        <>
          <Prompt message="Are you sure you want to leave? The backup code will not be displayed again." />
          <BackupCodesView
            codes={state.codes}
            printCodes={window.print}
            walletContract={deployedWallet.name}
            className={className}
          />
        </>);
    case 'Failure':
      return (
        <ErrorMessage
          title={'Generating backup code failed'}
          message={state.error}
        />
      );
  };
};

export default BackupCodes;
