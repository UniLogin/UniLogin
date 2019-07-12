import React, {useEffect, useState} from 'react';
import logo from '../../assets/logo.svg';
import {NavLink} from 'react-router-dom';
const Blockies = require('react-blockies').default;
import {useServices} from '../../hooks';

function Sidebar() {
  const {userDropdownService, notificationService, walletPresenter} = useServices();
  const [newNotifications, setNewNotifications] = useState(false);

  useEffect(() => notificationService.subscribe(notifications => setNewNotifications(notifications.length !== 0)), []);

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
