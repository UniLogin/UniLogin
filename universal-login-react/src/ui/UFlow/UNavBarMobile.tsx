import React from 'react';
import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import {Nav} from '../commons/Nav';

export interface UNavBarMobileProps {
  deployedWallet: DeployedWithoutEmailWallet;
}

export const UNavBarMobile = ({deployedWallet}: UNavBarMobileProps) => (
  <div className="udashboard-navbar">
    <Nav deployedWallet={deployedWallet}/>
  </div>
);
