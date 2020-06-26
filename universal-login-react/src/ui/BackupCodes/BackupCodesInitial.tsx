import React from 'react';
import {DeployedWallet} from '@unilogin/sdk';
import {OnGasParametersChanged, createFullHexString, GasParameters} from '@unilogin/commons';
import {BackupCodesWrapper} from './BackupCodesWrapper';
import {FooterSection} from '../commons/FooterSection';
import {GasPrice} from '../commons/GasPrice';
import {useAsync} from '../hooks/useAsync';

interface BackupCodesInitialProps {
  generateBackupCodes: () => void;
  deployedWallet: DeployedWallet;
  setGasParameters: OnGasParametersChanged;
  isButtonDisabled: boolean;
  className?: string;
  gasParameters?: GasParameters;
}

export const BackupCodesInitial = ({gasParameters, generateBackupCodes, deployedWallet, setGasParameters, className, isButtonDisabled}: BackupCodesInitialProps) => {
  const [estimatedGas] = useAsync(async () => gasParameters && deployedWallet.estimateGasFor('addKey', [createFullHexString(20)], gasParameters), [gasParameters]);

  return (<BackupCodesWrapper className={className}>
    <FooterSection>
      <GasPrice
        isDeployed={true}
        deployedWallet={deployedWallet}
        gasLimit={estimatedGas}
        onGasParametersChanged={setGasParameters}
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
  </BackupCodesWrapper>);
};
