import React from 'react';
import {Link} from 'react-router-dom';
import {CreateRandomInstance} from './CreateRandomInstance';

export interface NavigationColumnProps {
  ensName: string;
}

export const NavigationColumn = ({ensName}: NavigationColumnProps) => (
  <div className="playground-navigation">
    <ul>
      <li><Link to="/">Home Screen</Link></li>
    </ul>
    <ul>
      E2E flow
      <li><Link to="/onboarding">Onboarding</Link></li>
      <li><Link to="/logobutton">U</Link></li>
    </ul>
    <ul>
      Atomic components
      <li><Link to="/walletselector">Wallet Selector</Link></li>
      <li><Link to="/connecting">Connecting</Link></li>
      <li><Link to="/topup">Topup</Link></li>
      <li><Link to="/recover">Recover</Link></li>
      <li><Link to="/settings">Settings</Link></li>
    </ul>
    <hr/>
    <CreateRandomInstance ensName={ensName} />
  </div>
);
