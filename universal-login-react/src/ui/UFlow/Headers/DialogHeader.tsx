import React from 'react';
import {DeployedWallet} from '@unilogin/sdk';
import {Nav} from '../../commons/Nav';
import {CompanyLogo} from '../../commons/CompanyLogo';

export interface DialogHeaderProps {
  deployedWallet: DeployedWallet;
}

export const DialogHeader = ({deployedWallet}: DialogHeaderProps) => {
  return (
    <div className="udashboard-header">
      <CompanyLogo/>
      <div className="udashboard-header-nav">
        <Nav deployedWallet={deployedWallet}/>
      </div>
      <p className="udashboard-ens">{deployedWallet.name}</p>
    </div>
  );
};
