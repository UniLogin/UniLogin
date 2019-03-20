import React from 'react';
import logo from '../../assets/logo.svg';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <img src={logo} />
      <ul className="sidebar-list">
        <li className="sidebar-button sidebar-list-item">
          <NavLink exact to="/" id="homeLink" className="sidebar-link home-link" />
        </li>
        <li className="sidebar-button sidebar-list-item">
          <button className="sidebar-link settings-link" />
        </li>
        <li className="sidebar-button sidebar-list-item">
          <NavLink to="/notifications" id="notificationsLink" className="sidebar-link notifications-link active" />
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
