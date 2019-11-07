import React from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import {OnGasParametersChanged, DEFAULT_GAS_LIMIT} from '@universal-login/commons';
import {BackupCodesWrapper} from './BackupCodesWrapper';
import {FooterSection} from '../commons/FooterSection';
import {GasPrice} from '../commons/GasPrice';

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
        gasLimit={DEFAULT_GAS_LIMIT}
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
