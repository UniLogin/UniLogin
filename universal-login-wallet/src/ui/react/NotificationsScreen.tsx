import React from 'react';
import Sidebar from './common/Sidebar';
import {Notifications} from '@universal-login/react';
import UserDropdown from './common/UserDropdown';
import {useServices} from '../hooks';

const NotificationsScreen = () => {
  const {sdk, walletService} = useServices();
  const {contractAddress, privateKey} = walletService.applicationWallet!;
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content dashboard-content-subscreen">
        <UserDropdown />
        <Notifications sdk={sdk} contractAddress={contractAddress} privateKey={privateKey} />
      </div>
    </div>
  );
};

export default NotificationsScreen;
