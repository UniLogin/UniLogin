import React from 'react';
import {BackupCodesWrapper} from './BackupCodesWrapper';
import {FooterSection} from '../commons/FooterSection';
import {GasPrice} from '../..';
import {transactionDetails} from '../../core/constants/TransactionDetails';
import {DeployedWallet} from '@universal-login/sdk';
import {OnGasParametersChanged} from '@universal-login/commons';

interface BackupCodesInitialProps {
  generateBackupCodes: () => void;
  deployedWallet: DeployedWallet;
  setGasParameters: OnGasParametersChanged;
  className?: string;
}

export const BackupCodesInitial = ({generateBackupCodes, deployedWallet, setGasParameters, className}: BackupCodesInitialProps) => (
  <BackupCodesWrapper className={className}>
      <div>
        <p className="backup-subtitle">Generate a recovery code and keep it safe</p>
        <button
          className="backup-btn backup-btn-primary generate-code-btn"
          onClick={generateBackupCodes}
        >
          Generate new code
        </button>
      </div>
      <div>
        <FooterSection className={className}>
          <GasPrice
            isDeployed={true}
            deployedWallet={deployedWallet}
            gasLimit={transactionDetails.gasLimit!}
            onGasParametersChanged={setGasParameters}
            className={className}
          />
        </FooterSection>
      </div>
  </BackupCodesWrapper>
  );
