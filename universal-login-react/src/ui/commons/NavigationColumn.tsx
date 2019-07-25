import React from 'react';
import {Link} from 'react-router-dom';

export const NavigationColumn = () => (
  <div className="playground-navigation">
    <ul className="playground-navigation-list">
      <li><Link className="playground-navigation-link" to="/">Home Screen</Link></li>
    </ul>
    <ul className="playground-navigation-list">
      E2E flow
      <li><Link className="playground-navigation-link" to="/onboarding">Onboarding</Link></li>
    </ul>
    <ul className="playground-navigation-list">
      Atomic components
      <li><Link className="playground-navigation-link" to="/walletselector">Wallet Selector</Link></li>
      <li><Link className="playground-navigation-link" to="/connecting">Connecting</Link></li>
      <li><Link className="playground-navigation-link" to="/topup">Topup</Link></li>
      <li><Link className="playground-navigation-link" to="/recover">Recover</Link></li>
      <li><Link className="playground-navigation-link" to="/settings">Settings</Link></li>
    </ul>
  </div>
);
