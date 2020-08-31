import React from 'react';
import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import {Nav} from '../../commons/Nav';
import {CompanyLogo} from '../../commons/CompanyLogo';

export interface DialogHeaderProps {
  deployedWallet: DeployedWithoutEmailWallet;
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
