import React from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import {UDashboard} from './UDashboard';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

export interface LogoButtonProps {
  deployedWallet: DeployedWallet;
  className?: string;
}

export const LogoButton = ({deployedWallet, className}: LogoButtonProps) => {


  if (deployedWallet.contractAddress.length > 10) {
    return (
      <div className={getStyleForTopLevelComponent(className)}>
        <UDashboard deployedWallet={deployedWallet} />
      </div>
    );
  } else {
    return <></>;
  }
};
