import React from 'react';
import ManageDevices from './ManageDevices';
import BackupCodes from './BackupCodes/BackupCodes';
import './../styles/settings.css';
import './../styles/settingsDefaults.css';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

export interface SettingsProps {
  className?: string;
}

export const Settings = ({className}: SettingsProps) => (
  <div className="universal-login">
    <div className={getStyleForTopLevelComponent(className)}>
      <div className="settings">
        <h2 className="settings-title">Settings</h2>
        <ManageDevices />
        <BackupCodes />
      </div>
    </div>
  </div>
);
