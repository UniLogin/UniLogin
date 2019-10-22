import React from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import {Nav} from '../../commons/Nav';

export interface DialogHeaderProps {
  deployedWallet: DeployedWallet;
}

export const DialogHeader = ({deployedWallet}: DialogHeaderProps) => {
  return (
    <div className="udashboard-header">
      <div className="udashboard-header-nav">
        <Nav deployedWallet={deployedWallet}/>
      </div>
      <p className="udashboard-ens">{deployedWallet.name}</p>
    </div>
  );
};
