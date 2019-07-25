import React from 'react';
import {Link} from 'react-router-dom';
import {Onboarding} from '../Onboarding';

export const NavigationColumn = () => (
  <div style={{width: '20%'}}>
    <ul>
      <li><Link to="/">TODO Home Screen</Link></li>
      <li><Link to="/onboarding">TODO Onboarding</Link></li>
      <li><Link to="/walletselector">Wallet Selector</Link></li>
      <li><Link to="/connecting">Connecting</Link></li>
      <li><Link to="/notifications">TODO Notifications</Link></li>
      <li><Link to="/topup">TODO Topup</Link></li>
      <li><Link to="/recover">TODO Recover</Link></li>
      <li><Link to="/settings">TODO Settings</Link></li>
    </ul>
  </div>
);
