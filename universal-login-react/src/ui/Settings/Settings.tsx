import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import ManageDevices from './ManageDevices';
import BackupCodes from '../BackupCodes/BackupCodes';
import './../styles/settings.sass';
import './../styles/settingsDefaults.sass';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import Accordion from './Accordion';
import {useAsync} from '../hooks/useAsync';

export interface SettingsProps {
  sdk: UniversalLoginSDK;
  privateKey: string;
  contractAddress: string;
  className?: string;
}

export const Settings = ({sdk, contractAddress, privateKey, className}: SettingsProps) => {
  const [devices] = useAsync(async () => sdk.getConnectedDevices(contractAddress, privateKey), []);

  return (
    <div className="universal-login-settings">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="settings">
          <h2 className="settings-title">Settings</h2>
          <Accordion
            title="Manage devices"
            subtitle={devices ? `You currently have ${devices.length} authorized devices` : 'Devices are loading..'}
          >
            <ManageDevices
              devices={devices}
            />
          </Accordion>
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
