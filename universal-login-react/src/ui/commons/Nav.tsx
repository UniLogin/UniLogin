import React from 'react';
import {NavLink} from 'react-router-dom';

export const Nav = () => (
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
      <span className="udashboard-tab-text">Devices</span>
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
