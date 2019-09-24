import React, {useEffect, useState, useContext} from 'react';
import logo from '../../assets/logo.svg';
import {useServices} from '../../hooks';
import UserDropdown from '../common/UserDropdown';
import {Link} from 'react-router-dom';

export interface HeaderProps {
  setContent: (content: string) => void;
}

export function Header({setContent}: HeaderProps) {
  const {sdk, walletService} = useServices();
  const [newNotifications, setNewNotifications] = useState(false);
  const {contractAddress, privateKey} = walletService.getDeployedWallet();

  const updateNotifictions = (notifications: Notification[]) => setNewNotifications(notifications.length !== 0);

  useEffect(() => sdk.subscribeAuthorisations(contractAddress, privateKey, updateNotifictions), []);

  return (
    <div className="header">
      <Link className="header-logo-link" to="/">
        <img className="header-logo" src={logo} />
      </Link>
      <div className="header-row">
        <ul className="header-list">
          <li className="header-list-item">
            <button onClick={() => setContent('funds')} className="header-btn funds-btn">Funds</button>
          </li>
          <li className="header-list-item">
            <button className="header-btn transactions-btn">Transactions</button>
          </li>
          <li className="header-list-item">
              <button
              id="notificationsButton"
              className="header-btn devices-btn"
              onClick={() => setContent('devices')}
            >
              Devices
              {newNotifications && <div className="new-notifications" />}
            </button>
          </li>
          <li className="header-list-item">
            <button className="header-btn backup-btn">Backup</button>
          </li>
        </ul>
        <UserDropdown />
      </div>
    </div>
  );
}
