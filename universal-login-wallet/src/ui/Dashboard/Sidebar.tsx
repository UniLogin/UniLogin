import React from 'react';
import logo from '../../assets/logo.svg';

const Sidebar = () => (
  <div className="sidebar">
    <img src={logo} />
    <ul className="sidebar-list">
      <li className="sidebar-button sidebar-list-item">
        <button className="requse-funds-button" />
      </li>
      <li className="sidebar-button sidebar-list-item">
        <button className="transfer-funds-button" />
      </li>
      <li className="sidebar-button sidebar-list-item">
        <button className="send-invitation-button" />
      </li>
    </ul>
  </div>
);

export default Sidebar;
