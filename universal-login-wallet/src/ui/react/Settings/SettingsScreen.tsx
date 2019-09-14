import React from 'react';
import {Header} from '../Home/Header';
import {Settings} from '@universal-login/react';
import {useServices} from '../../hooks';

const SettingsScreen = () => {
  const {walletService} = useServices();
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content dashboard-content-subscreen">
        <Settings deployedWallet={walletService.getDeployedWallet()}/>
      </div>
    </div>
  );
};

export default SettingsScreen;
