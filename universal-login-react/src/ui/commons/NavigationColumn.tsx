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
      <li><Link to="/chooseToken">ChooseTopUpToken</Link></li>
      <li><Link to="/logoButton">U</Link></li>
    </ul>
    <ul>
      Atomic components
      <li><Link to="/walletSelector">Wallet Selector</Link></li>
      <li><Link to="/keyboard">Keyboard</Link></li>
      <li><Link to="/topUp">Topup</Link></li>
      <li><Link to="/recover">Recover</Link></li>
      <li><Link to="/settings">Settings</Link></li>
      <li><Link to="/waiting">Waiting for ramp</Link></li>
      <li><Link to="/waitForTransaction">Waiting for transaction</Link></li>
      <li><Link to="/waitForApp">Waiting for app</Link></li>
      <li><Link to="/themes">Themes</Link></li>
      <li><Link to="/errorMessage">Error Message</Link></li>
    </ul>
  </div>
);
