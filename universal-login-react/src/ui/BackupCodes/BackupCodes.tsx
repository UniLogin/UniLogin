import React, {useState} from 'react';
import {join} from 'path';
import {Switch, Route, useHistory, Prompt} from 'react-router';
import {Location} from 'history';
import {DeployedWallet} from '@universal-login/sdk';
import BackupCodesView from './BackupCodesView';
import './../styles/backup.sass';
import './../styles/backupDefault.sass';
import {BackupCodesInitial} from './BackupCodesInitial';
import {ErrorMessage} from '../commons/ErrorMessage';
import {WaitingForTransaction} from '../commons/WaitingForTransaction';
import {transactionDetails} from '../../core/constants/TransactionDetails';
import {GasParameters} from '@universal-login/commons';

export interface BackupProps {
  deployedWallet: DeployedWallet;
  basePath?: string;
  className?: string;
}

export const BackupCodes = ({deployedWallet, basePath = '', className}: BackupProps) => {
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [gasParameters, setGasParameters] = useState<GasParameters | undefined>(undefined);

  const history = useHistory();
  const relayerConfig = deployedWallet.sdk.getRelayerConfig();

  const generateBackupCodes = async () => {
    try {
      history.replace(join(basePath, 'waitingForBackupCodes'));
      const {waitToBeSuccess, waitForTransactionHash} = await deployedWallet.generateBackupCodes({...transactionDetails, ...gasParameters});
      const {transactionHash} = await waitForTransactionHash();
      history.replace(join(basePath, 'waitingForBackupCodes'), {transactionHash});
      const codes = await waitToBeSuccess();
      setBackupCodes(codes.concat(backupCodes));
      history.replace(join(basePath, 'backupCodesGenerated'));
    } catch (e) {
      console.error(e);
      history.replace(join(basePath, 'backupCodesFailure'));
    }
  };

  const waitingPromptMessage = (location: Location<any>) => {
    if (
      location.pathname.includes('waitingForBackupCodes') ||
      location.pathname.includes('backupCodesFailure') ||
      location.pathname.includes('backupCodesGenerated')
    ) {
      return true;
    }
    return 'Are you sure you want to leave? The backup codes are being generated.';
  };

  return (
    <Switch>
      <Route path={`${basePath}/`} exact>
        <BackupCodesInitial
          generateBackupCodes={generateBackupCodes}
          deployedWallet={deployedWallet}
          setGasParameters={setGasParameters}
          className={className}
        />
      </Route>
      <Route path={join(basePath, 'backupCodesFailure')} exact>
        <ErrorMessage className={className} />;
      </Route>
      <Route path={join(basePath, 'backupCodesGenerated')} exact>
        <Prompt message="Are you sure you want to leave? The backup codes will not be displayed again." />
        <BackupCodesView
          codes={backupCodes}
          printCodes={window.print}
          walletContract={deployedWallet.name}
          className={className}
        />
      </Route>
      <Route path={join(basePath, 'waitingForBackupCodes')} exact>
        <Prompt message={waitingPromptMessage} />
        <WaitingForTransaction
          action='Generating backup codes'
          relayerConfig={relayerConfig}
          className={className}
        />
      </Route>
    </Switch>
  );
};

export default BackupCodes;
