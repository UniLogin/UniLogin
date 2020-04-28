import React from 'react';
import {DeployedWallet} from '@unilogin/sdk';
import {OnGasParametersChanged, DEFAULT_GAS_LIMIT} from '@unilogin/commons';
import {BackupCodesWrapper} from './BackupCodesWrapper';
import {FooterSection} from '../commons/FooterSection';
import {GasPrice} from '../commons/GasPrice';

interface BackupCodesInitialProps {
  generateBackupCodes: () => void;
  deployedWallet: DeployedWallet;
  setGasParameters: OnGasParametersChanged;
  isButtonDisabled: boolean;
  className?: string;
}

export const BackupCodesInitial = ({generateBackupCodes, deployedWallet, setGasParameters, className, isButtonDisabled}: BackupCodesInitialProps) => (
  <BackupCodesWrapper className={className}>
    <FooterSection>
      <GasPrice
        isDeployed={true}
        deployedWallet={deployedWallet}
        gasLimit={DEFAULT_GAS_LIMIT}
        onGasParametersChanged={setGasParameters}
        className={className}
        sdk={deployedWallet.sdk}
      />
      <button
        disabled={isButtonDisabled}
        className="backup-btn backup-btn-primary generate-code-btn"
        onClick={generateBackupCodes}
      >
        Generate
      </button>
    </FooterSection>
  </BackupCodesWrapper>
);
