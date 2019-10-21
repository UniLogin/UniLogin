import React, {useEffect, useState} from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import './../../styles/newDeviceMessage.sass';
import './../../styles/newDeviceMessageDefault.sass';

interface NewDeviceMessageProps {
  deployedWallet: DeployedWallet;
  onClick: () => void;
  className?: string;
}

export const NewDeviceMessage = ({deployedWallet, onClick, className}: NewDeviceMessageProps) => {
  const [notifications, setNotifications] = useState([] as Notification[]);
  useEffect(() => deployedWallet.subscribeAuthorisations(setNotifications), []);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={getStyleForTopLevelComponent(className)}>
      <div className="devices-message">
        <div className="devices-message-row">
          <div className="devices-message-desription">
            <h3 className="devices-message-title">New device(s) want to connect to this account</h3>
            <p className="devices-message-text">We noticed a connection from an unrecognized device, you need to enter an
                emoji sequence before you can access your account.</p>
          </div>
          <button onClick={onClick} className="devices-message-button">Manage</button>
        </div>
      </div>
    </div>
  );
};
