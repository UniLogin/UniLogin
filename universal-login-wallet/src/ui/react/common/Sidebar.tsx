import React, {useEffect, useState} from 'react';
import logo from '../../assets/logo.svg';
import {NavLink} from 'react-router-dom';
const Blockies = require('react-blockies').default;
import {useServices} from '../../hooks';

function Sidebar() {
  const {userDropdownService, walletPresenter, sdk, walletService} = useServices();
  const [newNotifications, setNewNotifications] = useState(false);
  const {contractAddress, privateKey} = walletService.applicationWallet!;

  const updateNotifictions = (notifications: Notification[]) => setNewNotifications(notifications.length !== 0);

  useEffect(() => sdk.subscribeAuthorisations(contractAddress, privateKey, updateNotifictions), []);

  return (
    <div className="sidebar">
      <img className="sidebar-logo" src={logo} />
      <ul className="sidebar-list">
        <li className="sidebar-button sidebar-list-item">
          <NavLink exact to="/" id="homeLink" className="sidebar-link home-link" />
        </li>
        <li className="sidebar-button sidebar-list-item">
          <NavLink exact to="/settings" id="settingsLink" className="sidebar-link settings-link" />
        </li>
        <li className="sidebar-button sidebar-list-item">
          <NavLink
            to="/notifications"
            id="notificationsLink"
            className={`sidebar-link notifications-link ${newNotifications ? 'new-notifications' : ''}`}
          />
        </li>
        <li className="sidebar-button sidebar-list-item">
          <button onClick={() => userDropdownService.setDropdownVisibility(true)} className="user-btn">
            <Blockies seed={walletPresenter.getContractAddress()} size={8} scale={4} />
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
