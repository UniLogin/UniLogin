import React, {useEffect, useState} from 'react';
import logo from '../../assets/logo.svg';
import settingsIcon from './../../assets/icons/gear.svg';
import notificationsIcon from './../../assets/icons/bell.svg';
const Blockies = require('react-blockies').default;
import {useServices} from '../../hooks';
import UserDropdown from '../common/UserDropdown';
import {Link} from 'react-router-dom';

export function Header() {
  const {userDropdownService, walletPresenter, sdk, walletService} = useServices();
  const [newNotifications, setNewNotifications] = useState(false);
  const {contractAddress, privateKey} = walletService.applicationWallet!;

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
            <Link
              to="/settings"
              id="settingsLink"
              className="header-btn settings-btn"
            >
              <img src={settingsIcon} alt="settings"/>
            </Link>
          </li>
          <li className="header-list-item">
            <Link
              to="/notifications"
              id="notificationsLink"
              className={`header-btn notifications-btn ${newNotifications ? 'new-notifications' : ''}`}
            >
              <img src={notificationsIcon} alt="notifications"/>
            </Link>
          </li>
          <li className="header-list-item">
            <button onClick={() => userDropdownService.setDropdownVisibility(true)} className="user-btn">
              <Blockies seed={walletPresenter.getContractAddress()} size={8} scale={4} />
            </button>
          </li>
        </ul>
        <UserDropdown />
      </div>
    </div>
  );
}
