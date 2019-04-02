import React, { useState } from 'react';
import logo from '../../assets/logo.svg';
import { NavLink } from 'react-router-dom';
import avatar from '../../assets/avatar.svg';
import { useServices } from '../../hooks';

function Sidebar() {
  const {userDropdownService} = useServices();
  const [newNotifications] = useState(true);

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
            <img src={avatar} alt="user avatar"/>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
