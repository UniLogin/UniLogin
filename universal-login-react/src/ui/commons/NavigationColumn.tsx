import React from 'react';
import {Link} from 'react-router-dom';

export const NavigationColumn = () => (
  <div className="playground-navigation">
    <ul>
      <li><Link to="/wallet">Home Screen</Link></li>
    </ul>
    <ul>
      E2E flow
      <li><Link to="/onboarding">Onboarding</Link></li>
      <li><Link to="/logoButton">U</Link></li>
    </ul>
    <ul>
      Atomic components
      <li><Link to="/walletSelector">Wallet Selector</Link></li>
      <li><Link to="/keyboard">Keyboard</Link></li>
      <li><Link to="/topUp">Topup</Link></li>
      <li><Link to="/recover">Recover</Link></li>
      <li><Link to="/settings">Settings</Link></li>
      <li><Link to="/waiting">Waiting</Link></li>
    </ul>
  </div>
);
