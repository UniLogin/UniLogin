import React, {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import {useAsyncEffect} from '../hooks/useAsyncEffect';

export interface NavProps {
  deployedWallet: DeployedWithoutEmailWallet;
}

export const Nav = ({deployedWallet}: NavProps) => {
  const [newNotifications, setNewNotifications] = useState(false);
  const updateNotifictions = (notifications: Notification[]) => setNewNotifications(notifications.length !== 0);
  useAsyncEffect(() => deployedWallet.subscribeAuthorisations(updateNotifictions), [deployedWallet]);

  return (
    <>
      <NavLink
        className="udashboard-tab udashboard-tab-funds"
        activeClassName="active"
        to="/dashboard/funds"
      >
        <span className="udashboard-tab-text">Funds</span>
      </NavLink>
      <NavLink
        className="udashboard-tab udashboard-tab-devices"
        activeClassName="active"
        to="/dashboard/devices"
      >
        <span className={`udashboard-tab-text ${newNotifications && 'new-notifications'}`}>
          Devices
        </span>
      </NavLink>
      <NavLink
        className="udashboard-tab udashboard-tab-backup"
        activeClassName="active"
        to="/dashboard/backup"
      >
        <span className="udashboard-tab-text">Backup</span>
      </NavLink>
    </>
  );
};
