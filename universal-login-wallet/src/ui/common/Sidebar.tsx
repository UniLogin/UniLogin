import React, {useEffect, useState} from 'react';
import logo from '../assets/logo.svg';
import { NavLink } from 'react-router-dom';
import avatar from '../assets/avatar.svg';
import { useServices } from '../hooks';

function Sidebar() {
  const {userDropdownService, notificationService} = useServices();
  const [newNotifications, setNewNotifications] = useState(false);

  useEffect(() => notificationService.subscribe(notifications => setNewNotifications(notifications.length !== 0)));

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
          <NavLink
            to="/compound"
            id="compoundLink"
            className={`sidebar-link compound-link`}
          />
        </li>
        <li className="sidebar-button sidebar-list-item">
          <button onClick={() => userDropdownService.setDropdownVisibility(true)} className="user-btn">
            <img src={avatar} alt="user avatar"/>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
