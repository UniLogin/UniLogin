import React from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import {Nav} from '../commons/Nav';

export interface UNavBarMobileProps {
  deployedWallet: DeployedWallet;
}

export const UNavBarMobile = ({deployedWallet}: UNavBarMobileProps) => (
  <div className="udashboard-navbar">
    <Nav deployedWallet={deployedWallet}/>
  </div>
);
