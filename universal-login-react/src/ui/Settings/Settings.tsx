import React from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import ManageDevices from './ManageDevices';
import BackupCodes from '../BackupCodes/BackupCodes';
import './../styles/settings.sass';
import './../styles/settingsDefaults.sass';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import Accordion from './Accordion';
import {useAsync} from '../hooks/useAsync';

export interface SettingsProps {
  deployedWallet: DeployedWallet;
  className?: string;
}

export const Settings = ({deployedWallet, className}: SettingsProps) => {
  const [devices] = useAsync(async () => deployedWallet.getConnectedDevices(), []);

  return (
    <div className="universal-login-settings">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="settings">
          <h2 className="settings-title">Settings</h2>
          {devices
            ? <Accordion
              title="Manage devices"
              subtitle={`You currently have ${devices.length} authorized devices`}
            >
              <ManageDevices
                deployedWallet={deployedWallet}
                devices={devices}
              />
            </Accordion>
            : 'Devices are loading..'}
          <Accordion
            title="Backup code"
            subtitle="Back up your account"
          >
            <BackupCodes />
          </Accordion>
        </div>
      </div>
    </div>
  );
};
