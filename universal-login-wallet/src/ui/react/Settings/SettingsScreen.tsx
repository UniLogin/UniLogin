import React from 'react';
import {Header} from '../Home/Header';
import {Settings} from '@universal-login/react';
import {useServices} from '../../hooks';

const SettingsScreen = () => {
  const {walletService, sdk} = useServices();
  const {contractAddress, privateKey} = walletService.getDeployedWallet();
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content dashboard-content-subscreen">
        <Settings sdk={sdk} contractAddress={contractAddress} privateKey={privateKey}/>
      </div>
    </div>
  );
};

export default SettingsScreen;
