import React from 'react';
import ManageDevices from './ManageDevices';
import BackupCodes from '../BackupCodes/BackupCodes';
import './../styles/settings.sass';
import './../styles/settingsDefaults.sass';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import Accordion from './Accordion';

export interface SettingsProps {
  className?: string;
}

export const Settings = ({className}: SettingsProps) => (
  <div className="universal-login-settings">
    <div className={getStyleForTopLevelComponent(className)}>
      <div className="settings">
        <h2 className="settings-title">Settings</h2>
        <Accordion
          title="Manage devices"
          subtitle="You currently have 3 authorized devices"
        >
          <ManageDevices />
        </Accordion>
        <Accordion
          title="Backup code"
          subtitle="Back up your account"
        >
          <BackupCodes className={className} />
        </Accordion>
      </div>
    </div>
  </div>
);
