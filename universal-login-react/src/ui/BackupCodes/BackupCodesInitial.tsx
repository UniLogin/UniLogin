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
    <FooterSection className={className}>
      <GasPrice
        isDeployed={true}
        deployedWallet={deployedWallet}
        gasLimit={transactionDetails.gasLimit!}
        onGasParametersChanged={setGasParameters}
        className={className}
      />
      <button
        className="backup-btn backup-btn-primary generate-code-btn"
        onClick={generateBackupCodes}
      >
        Generate new code
      </button>
    </FooterSection>
  </BackupCodesWrapper>
);
