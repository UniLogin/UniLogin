import React from 'react';
import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import {OnGasParametersChanged, DEFAULT_GAS_LIMIT} from '@unilogin/commons';
import {BackupCodesWrapper} from './BackupCodesWrapper';
import {FooterSection} from '../commons/FooterSection';
import {GasPrice} from '../commons/GasPrice';
import {PrimaryButton} from '../commons/Buttons/PrimaryButton';

interface BackupCodesInitialProps {
  generateBackupCodes: () => void;
  deployedWallet: DeployedWithoutEmailWallet;
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
        sdk={deployedWallet.sdk}
      />
      <PrimaryButton
        text='Generate'
        disabled={isButtonDisabled}
        className="backup-btn backup-btn-primary generate-code-btn"
        onClick={generateBackupCodes}
      />
    </FooterSection>
  </BackupCodesWrapper>
);
