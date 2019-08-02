import React from 'react';
import {Header} from './Home/Header';
import {Notifications} from '@universal-login/react';
import {useServices} from '../hooks';

const NotificationsScreen = () => {
  const {sdk, walletService} = useServices();
  const {contractAddress, privateKey} = walletService.applicationWallet!;
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content dashboard-content-subscreen">
        <Notifications sdk={sdk} contractAddress={contractAddress} privateKey={privateKey} />
      </div>
    </div>
  );
};

export default NotificationsScreen;
