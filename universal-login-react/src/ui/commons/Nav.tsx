import React from 'react';
import {DashboardContentType} from '../../core/models/ReactUDashboardContentType';

export interface NavProps {
  activeTab: DashboardContentType;
  setActiveTab: (tab: DashboardContentType) => void;
}

export const Nav = ({activeTab, setActiveTab}: NavProps) => (
  <>
    <button
      className={`udashboard-tab udashboard-tab-funds ${activeTab === 'funds' ? 'active' : ''}`}
      onClick={() => setActiveTab('funds')}
    >
      Funds
    </button>
    <button
      className={`udashboard-tab udashboard-tab-devices ${activeTab === 'devices' ? 'active' : ''}`}
      onClick={() => setActiveTab('devices')}
    >
      Devices
    </button>
    <button
      className={`udashboard-tab udashboard-tab-backup ${activeTab === 'backup' ? 'active' : ''}`}
      onClick={() => setActiveTab('backup')}
    >
      Backup
    </button>
  </>
);
